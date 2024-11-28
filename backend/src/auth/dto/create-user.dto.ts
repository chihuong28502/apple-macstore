export class CreateUserDto {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly role: string; 
  readonly profile: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}
