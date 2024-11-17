import { ConfigService } from '@nestjs/config';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const configService = new ConfigService(); // Tạo một instance mới của ConfigService
      const corsOrigins = configService.get<string>('CORS_ORIGIN', '').split(',');
      if (corsOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})
export class CartsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Đối tượng để lưu trữ các client kết nối
  private connectedClients: Map<string, Socket> = new Map();

  // Khi một client kết nối
  handleConnection(client: Socket) {
    this.connectedClients.set(client.id, client); // Thêm client vào Map
  }

  // Khi một client ngắt kết nối
  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id); // Xóa client khỏi Map
  }

  // Gửi thông báo đến tất cả client
  sendEventAddCart(cart: any) {
    this.server.emit('add-cart', cart); // Gửi thông báo đến tất cả client
  }

  // Nếu bạn muốn lắng nghe các sự kiện từ client
  @SubscribeMessage('clientEvent')
  handleClientEvent(client: Socket, payload: any) {
    // Xử lý sự kiện từ client tại đây
  }
}
