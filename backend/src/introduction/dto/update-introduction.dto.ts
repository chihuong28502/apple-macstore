import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ImageDto {
  @IsString()
  image: string;

  @IsString()
  publicId: string;

  @IsString()
  @IsOptional()
  _id?: string;
}

export class UpdateIntroductionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  type?: string;

  @ValidateNested()
  @Type(() => ImageDto)
  @IsOptional()
  images?: ImageDto;

  @IsString()
  @IsOptional()
  description?: string;
}
