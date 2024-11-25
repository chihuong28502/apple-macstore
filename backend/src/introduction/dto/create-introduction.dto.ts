import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class ImageDto {
  @IsString()
  image: string;

  @IsString()
  publicId: string;

  @IsString()
  @IsOptional()
  _id?: string;
}

export class CreateIntroductionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @IsString()
  @IsNotEmpty()
  type: string;

  @ValidateNested()
  @Type(() => ImageDto)
  @IsOptional()
  images?: ImageDto;

  @IsString()
  @IsNotEmpty()
  description: string;
}
