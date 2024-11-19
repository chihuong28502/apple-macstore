import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';



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

  @IsArray()
  @ArrayNotEmpty()
  images?: { image: string; publicId: string; _id?: string }[];

  @IsString()
  @IsNotEmpty()
  description: string;
}
