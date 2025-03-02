import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/them.service';
import { HomeComponent } from './features/user/home/home.component';
import { LoginComponent } from './features/user/login/login.component';
import { RegisterComponent } from './features/user/register/register.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HomeComponent, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private themeService: ThemeService) {}

  changeTheme(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      this.themeService.setTheme(target.value as keyof typeof this.themeService['themes']);
    }
  }


}
