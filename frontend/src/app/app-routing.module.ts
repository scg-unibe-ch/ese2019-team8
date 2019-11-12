import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './Components/login/login.component';
import {RegistrationComponent} from './Components/registration/registration.component';
import {ServiceRegPageComponent} from './Components/serviceRegPage/serviceRegPage.component';
import {HomePageComponent} from './Components/home-page/home-page.component';


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'serviceRegistration', component: ServiceRegPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
