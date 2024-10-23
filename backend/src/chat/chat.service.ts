import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schema/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const createdChat = new this.chatModel(createChatDto);
    return createdChat.save();
  }

  async findAll(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }

  async findOne(id: string): Promise<Chat> {
    const chat = await this.chatModel.findById(id).exec();
    if (!chat) {
      throw new NotFoundException(`Chat with ID "${id}" not found`);
    }
    return chat;
  }

  async update(id: string, updateChatDto: UpdateChatDto): Promise<Chat> {
    const updatedChat = await this.chatModel.findByIdAndUpdate(id, updateChatDto, { new: true }).exec();
    if (!updatedChat) {
      throw new NotFoundException(`Chat with ID "${id}" not found`);
    }
    return updatedChat;
  }

  async remove(id: string): Promise<Chat> {
    const deletedChat = await this.chatModel.findByIdAndDelete(id).exec();
    if (!deletedChat) {
      throw new NotFoundException(`Chat with ID "${id}" not found`);
    }
    return deletedChat;
  }
}
