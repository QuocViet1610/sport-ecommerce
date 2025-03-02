import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class BlogService {
  private apiUrl = 'https://ninedev-api.vercel.app/blogs';

  constructor(private http: HttpClient) {}

  // Phương thức để lấy danh sách blog từ API
  getBlogs(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }


}
