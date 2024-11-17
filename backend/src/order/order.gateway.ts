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
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Lang'],
    credentials: true,
  },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
  sendOrder(order: any) {
    this.server.emit('check-order', order); // Gửi thông báo tới tất cả các client
  }

  // Thêm đơn hàng và gửi đến tất cả client
  addOrder(order: any) {
    this.server.emit('add-order', order); // Gửi đơn hàng mới tới tất cả các client
  }

  // Nếu bạn muốn lắng nghe các sự kiện từ client
  @SubscribeMessage('clientEvent')
  handleClientEvent(client: Socket, payload: any) {
    // Xử lý sự kiện từ client tại đây
  }
}
