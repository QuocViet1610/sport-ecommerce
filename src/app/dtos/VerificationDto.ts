export class VerificationDto {

  email: string;
  otp: string;

  constructor(data: any) {
      this.email = data.email;
      this.otp = data.otp;
  }
}
