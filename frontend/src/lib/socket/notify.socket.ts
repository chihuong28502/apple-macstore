import { io, Socket } from "socket.io-client";

// Hàm tạo kết nối socket
export const createSocketConnection = (url: string): Socket => {
  const socket = io(url);
  return socket;
};

export const listenToSocketEvent = (socket: Socket, event: string, callback: (data: any) => void) => {
  socket.on(event, callback);
};

// Hàm hủy lắng nghe một sự kiện
export const cleanupSocketEvent = (socket: Socket, event: string) => {
  socket.off(event);
};

// Hàm phát một sự kiện
export const emitSocketEvent = (socket: Socket, event: string, data: any) => {
  socket.emit(event, data);
};
