export class UpdateUserDto {
  username?: string;
  email?: string;
  role?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  };
}
