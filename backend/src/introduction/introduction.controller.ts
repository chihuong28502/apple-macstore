import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { IntroductionService } from './introduction.service';
import { CreateIntroductionDto } from './dto/create-introduction.dto';
import { Introduction } from './schema/introduction.schema';
import { UpdateIntroductionDto } from './dto/update-introduction.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RulesGuard } from 'src/common/guards/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseDto } from 'src/utils/dto/response.dto';

@UseGuards(JwtAuthGuard, RulesGuard)
@Roles('admin')
@Controller('introductions')
export class IntroductionController {
  constructor(private readonly introductionService: IntroductionService) { }

  @Post()
  async create(@Body() createIntroductionDto: CreateIntroductionDto): Promise<ResponseDto<Introduction>> {
    return this.introductionService.create(createIntroductionDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<ResponseDto<Introduction[]>> {
    return this.introductionService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseDto<Introduction>> {
    return this.introductionService.findOne(id);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateIntroductionDto: UpdateIntroductionDto): Promise<ResponseDto<Introduction>> {
    return this.introductionService.update(id, updateIntroductionDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string): Promise<ResponseDto<Introduction>> {
    return this.introductionService.remove(id);
  }
}
