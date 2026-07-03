// src/utils/network.ts
import os from 'os';

/**
 * 获取本机 IPv4 地址（非 127.0.0.1）
 * 返回第一个可用的局域网 IP，如果没有则返回 'localhost'
 */
export function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (!iface) continue;
    for (const alias of iface) {
      // 过滤 IPv4、非内部地址
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}
