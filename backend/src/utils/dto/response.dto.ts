export class ResponseDto<T> {
  data?: T | any;          
  message: string;    
  success: boolean;  
}
