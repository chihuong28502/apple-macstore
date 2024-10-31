import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateNotifyDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsMongoId()
  customer?: string;

  @IsOptional()
  @IsBoolean()
  isGlobal?: boolean;
}