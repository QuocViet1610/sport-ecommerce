export class RegisterDTO {

  fullName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;

  constructor(data: any) {
      this.fullName = data.fullName;
      this.email = data.email;
      this.phone = data.phone;
      this.password = data.password;
      this.passwordConfirm = data.confirmPassword;
  }
}
