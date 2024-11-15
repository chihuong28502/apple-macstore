import { ConfigService } from '@nestjs/config';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

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
export class CartsGateway {
  @WebSocketServer() server: Server;

  // Gửi thông báo đến tất cả client
  sendEventAddCart(cart: any) {
    console.log("🚀 ~ CartsGateway ~ cart:", cart)
    this.server.emit('add-cart', cart);
  }

  // Nếu bạn muốn lắng nghe các sự kiện từ client
  @SubscribeMessage('clientEvent')
  handleClientEvent(client: any, payload: any) {
    // Xử lý sự kiện từ client
  }
}
