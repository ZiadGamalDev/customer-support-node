let io;

export const setSocketIO = (ioInstance) => {
  io = ioInstance;
};

export const getSocketIO = () => io;
