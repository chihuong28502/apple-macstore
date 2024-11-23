import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RulesGuard } from 'src/common/guards/auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreateIntroductionDto } from './dto/create-introduction.dto';
import { UpdateIntroductionDto } from './dto/update-introduction.dto';
import { IntroductionService } from './introduction.service';
import { Introduction } from './schema/introduction.schema';

@UseGuards(JwtAuthGuard, RulesGuard)
@Roles('admin')
@Controller('introductions')
export class IntroductionController {
  constructor(private readonly introductionService: IntroductionService) { }

  @Public()
  @Post()
  async create(@Body() createIntroductionDto: CreateIntroductionDto): Promise<ResponseDto<Introduction>> {
    return this.introductionService.create(createIntroductionDto);
  }

  @Get()
  async findAll(): Promise<ResponseDto<Introduction[]>> {
    return this.introductionService.findAll();
  }

  @Public()
  @Get('customer')
  async findAllByCustomer(): Promise<ResponseDto<Introduction[]>> {
    return this.introductionService.findAllByCustomer();
  }

  @Public()
  @Get('ads')
  async findAllByAds(): Promise<ResponseDto<Introduction[]>> {
    return  await this.introductionService.findAllByAds();
  }

  @Public()
  @Get('banner')
  async findAllByBanner(): Promise<ResponseDto<Introduction[]>> {
    return  await this.introductionService.findAllByBanner();
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
