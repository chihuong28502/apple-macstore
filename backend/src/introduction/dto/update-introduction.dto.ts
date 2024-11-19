import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';


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

  @IsArray()
  @IsOptional()
  images?: { image: string; publicId: string; _id?: string }[];

  @IsString()
  @IsOptional()
  description?: string;
}
