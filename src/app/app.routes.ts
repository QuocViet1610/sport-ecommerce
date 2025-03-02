import { Routes } from '@angular/router';
import { LoginComponent } from './features/user/login/login.component';
import { HomeComponent } from './features/user/home/home.component';
import { RegisterComponent } from './features/user/register/register.component';



export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
];
