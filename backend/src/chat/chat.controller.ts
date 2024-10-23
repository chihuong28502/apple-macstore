import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './schema/chat.schema';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    return this.chatService.create(createChatDto);
  }

  @Get()
  async findAll(): Promise<Chat[]> {
    return this.chatService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Chat> {
    return this.chatService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto): Promise<Chat> {
    return this.chatService.update(id, updateChatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Chat> {
    return this.chatService.remove(id);
  }
}
