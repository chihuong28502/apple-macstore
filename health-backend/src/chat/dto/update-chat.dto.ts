export class UpdateChatDto {
  readonly participants?: string[];
  readonly messages?: {
    senderId: string;
    message: string;
    createdAt?: Date;
  }[];
}
