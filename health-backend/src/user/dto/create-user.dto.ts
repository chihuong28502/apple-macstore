export class CreateUserDto {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;  // 'customer', 'admin', 'expert'
  readonly profile: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    shoeSize: number;
    footType: string;
    activityGoal: string;
  };
}
