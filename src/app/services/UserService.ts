import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../environment/environment";
import { LoginDTO } from "../dtos/loginDto";
import { Observable } from "rxjs";
import { RegisterDTO } from "../dtos/RegisterDto";
import { VerificationDto } from "../dtos/VerificationDto";
import { HttpUtilService } from "./http.util.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/auth/register`;
  private apiLogin = `${environment.apiBaseUrl}/auth/login`;
  private apiverify= `${environment.apiBaseUrl}/auth/verify-otp`;
  private apiSendOtp= `${environment.apiBaseUrl}/auth/send-otp`;

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }

  apiConfig: any;
  ngOnInit() {
    this.apiConfig = {
      headers: this.httpUtilService.createHeaders(),
    };
  }

  register(registerDTO: RegisterDTO):Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }

  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  }


  verify(verificationDto: VerificationDto): Observable<any> {
    return this.http.post(this.apiverify, verificationDto, this.apiConfig);
  }

  sendOtp(registerDTO: RegisterDTO): Observable<any> {
    return this.http.post(this.apiSendOtp, registerDTO, this.apiConfig);
  }
}
