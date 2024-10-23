export class CreateChatDto {
  readonly participants: string[];  // Array of user IDs involved in the chat
  readonly messages: {
    senderId: string;
    message: string;
    createdAt?: Date;
  }[];
}
