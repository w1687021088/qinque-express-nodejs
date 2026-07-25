/**
 * 浮点数计算工具。
 *
 * 内部将小数转换为整数和小数位数后再进行计算，避免 JavaScript 原生浮点运算的精度误差。
 * 除法和最终转换为 number 后仍受 Number 可表示范围限制；金额等需要持久化的场景建议使用 format 的结果。
 */
export type FloatInput = number | string;

type Decimal = {
  coefficient: bigint;
  scale: number;
};

type RoundingMode = 'half-up' | 'truncate';

const MAX_DIVISION_PRECISION = 100;
const MAX_SCALE = 10_000;
const decimalPattern = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/;

function powerOfTen(exponent: number): bigint {
  return 10n ** BigInt(exponent);
}

function normalize(decimal: Decimal): Decimal {
  let { coefficient, scale } = decimal;

  if (coefficient === 0n) {
    return { coefficient: 0n, scale: 0 };
  }

  while (scale > 0 && coefficient % 10n === 0n) {
    coefficient /= 10n;
    scale -= 1;
  }

  return { coefficient, scale };
}

function parse(value: FloatInput): Decimal {
  if (typeof value === 'number' && !Number.isFinite(value)) {
    throw new TypeError('浮点计算仅支持有限数字');
  }

  const input = String(value).trim();
  const matched = decimalPattern.exec(input);

  if (!matched || (!matched[2] && !matched[3])) {
    throw new TypeError(`无效的小数值：${input}`);
  }

  const [, sign, integer = '', fraction = '', exponentText] = matched;
  const exponent = exponentText ? Number(exponentText) : 0;

  if (!Number.isSafeInteger(exponent)) {
    throw new RangeError('小数指数超出支持范围');
  }

  const digits = `${integer || '0'}${fraction}`.replace(/^0+(?=\d)/, '');
  const coefficient = BigInt(`${sign === '-' ? '-' : ''}${digits || '0'}`);
  const scale = fraction.length - exponent;

  if (Math.abs(scale) > MAX_SCALE) {
    throw new RangeError(`小数位数不能超过 ${MAX_SCALE}`);
  }

  if (scale >= 0) {
    return normalize({ coefficient, scale });
  }

  return normalize({ coefficient: coefficient * powerOfTen(-scale), scale: 0 });
}

function addDecimals(left: Decimal, right: Decimal): Decimal {
  const scale = Math.max(left.scale, right.scale);
  const leftCoefficient = left.coefficient * powerOfTen(scale - left.scale);
  const rightCoefficient = right.coefficient * powerOfTen(scale - right.scale);

  return normalize({ coefficient: leftCoefficient + rightCoefficient, scale });
}

function multiplyDecimals(left: Decimal, right: Decimal): Decimal {
  return normalize({ coefficient: left.coefficient * right.coefficient, scale: left.scale + right.scale });
}

function roundQuotient(numerator: bigint, denominator: bigint, mode: RoundingMode): bigint {
  const isNegative = (numerator < 0n) !== (denominator < 0n);
  const absoluteNumerator = numerator < 0n ? -numerator : numerator;
  const absoluteDenominator = denominator < 0n ? -denominator : denominator;
  let quotient = absoluteNumerator / absoluteDenominator;

  if (mode === 'half-up' && (absoluteNumerator % absoluteDenominator) * 2n >= absoluteDenominator) {
    quotient += 1n;
  }

  return isNegative ? -quotient : quotient;
}

function divideDecimals(left: Decimal, right: Decimal, precision: number, mode: RoundingMode): Decimal {
  if (right.coefficient === 0n) {
    throw new RangeError('除数不能为 0');
  }

  let numerator = left.coefficient;
  let denominator = right.coefficient;
  const exponent = precision + right.scale - left.scale;

  if (exponent >= 0) {
    numerator *= powerOfTen(exponent);
  } else {
    denominator *= powerOfTen(-exponent);
  }

  return normalize({ coefficient: roundQuotient(numerator, denominator, mode), scale: precision });
}

function formatDecimal(decimal: Decimal): string {
  const normalized = normalize(decimal);

  if (normalized.coefficient === 0n) {
    return '0';
  }

  const sign = normalized.coefficient < 0n ? '-' : '';
  const digits = (normalized.coefficient < 0n ? -normalized.coefficient : normalized.coefficient).toString();

  if (normalized.scale === 0) {
    return `${sign}${digits}`;
  }

  if (digits.length <= normalized.scale) {
    return `${sign}0.${'0'.repeat(normalized.scale - digits.length)}${digits}`;
  }

  const decimalIndex = digits.length - normalized.scale;
  return `${sign}${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
}

function toNumber(decimal: Decimal): number {
  const result = Number(formatDecimal(decimal));

  if (!Number.isFinite(result)) {
    throw new RangeError('计算结果超出 Number 可表示范围');
  }

  return result;
}

function validatePrecision(precision: number): void {
  if (!Number.isInteger(precision) || precision < 0 || precision > MAX_DIVISION_PRECISION) {
    throw new RangeError(`精度必须是 0 到 ${MAX_DIVISION_PRECISION} 之间的整数`);
  }
}

/**
 * 处理常见浮点运算。运算结果为 number，适合接口计算和展示。
 */
export class FloatCalculator {
  /** 精确相加，例如 add(0.1, 0.2) 的结果为 0.3。 */
  static add(...values: FloatInput[]): number {
    return toNumber(values.map(parse).reduce(addDecimals, { coefficient: 0n, scale: 0 }));
  }

  /** 精确相减。 */
  static subtract(left: FloatInput, right: FloatInput): number {
    const rightDecimal = parse(right);
    return toNumber(addDecimals(parse(left), { ...rightDecimal, coefficient: -rightDecimal.coefficient }));
  }

  /** 精确相乘。 */
  static multiply(...values: FloatInput[]): number {
    return toNumber(values.map(parse).reduce(multiplyDecimals, { coefficient: 1n, scale: 0 }));
  }

  /**
   * 精确相除，默认保留 12 位小数并按四舍五入处理。
   */
  static divide(left: FloatInput, right: FloatInput, precision: number = 12): number {
    validatePrecision(precision);
    return toNumber(divideDecimals(parse(left), parse(right), precision, 'half-up'));
  }

  /**
   * 按指定小数位四舍五入。
   */
  static round(value: FloatInput, precision: number = 0): number {
    validatePrecision(precision);
    return toNumber(divideDecimals(parse(value), { coefficient: 1n, scale: 0 }, precision, 'half-up'));
  }

  /**
   * 返回不受 Number 二次计算影响的精确十进制字符串，适合金额等需持久化的数值。
   */
  static format(value: FloatInput): string {
    return formatDecimal(parse(value));
  }
}
