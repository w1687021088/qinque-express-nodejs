let isApplicationReady = false;

export const setApplicationReady = (ready: boolean) => {
  isApplicationReady = ready;
};

export const getApplicationReady = () => isApplicationReady;
