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
export class ReviewsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private connectedClients: Map<string, Socket> = new Map();

  constructor(private readonly configService: ConfigService) { }

  handleConnection(client: Socket) {
    this.connectedClients.set(client.id, client);
    client.setMaxListeners(50); // Tăng giới hạn listeners nếu cần
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    client.removeAllListeners(); // Hủy bỏ tất cả các listener khi client ngắt kết nối
  }

  // Gửi đánh giá đến tất cả client
  sendReview(review: any) {
    this.server.emit('newReview', review); // Gửi đánh giá mới đến tất cả client
  }

  // Lắng nghe sự kiện gửi đánh giá từ client
  @SubscribeMessage('submitReview')
  handleSubmitReview(client: Socket, payload: any) {
    // Gửi lại đánh giá cho tất cả client
    this.sendReview(payload);
  }
}