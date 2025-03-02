export interface LoginResponse {
  datetime: string;
  code: string;
  message: string;
  data: {
    token: string;
    authenticated: boolean;
  };

}
