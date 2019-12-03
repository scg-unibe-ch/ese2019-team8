import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './Components/login/login.component';
import {RegistrationComponent} from './Components/registration/registration.component';
import {ServiceRegPageComponent} from './Components/serviceRegPage/serviceRegPage.component';
import {HomePageComponent} from './Components/home-page/home-page.component';
import {ProfilePageComponent} from './Components/profile-page/profile-page.component';
import {SearcherComponent} from './Components/searcher/searcher.component';
import {EventServiceComponent} from './Components/event-service/event-service.component';
import {ChangePasswordPageComponent} from './Components/change-password-page/change-password-page.component';
import {ServiceDetailsComponent} from './Components/service-details/service-details.component';


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'serviceRegistration', component: ServiceRegPageComponent},
  {path: 'profilePage', component: ProfilePageComponent},
  {path: 'search', component: SearcherComponent},
  {path: 'service', component: EventServiceComponent},
  {path: 'changePW', component: ChangePasswordPageComponent},
  {path: 'serviceDetails', component: ServiceDetailsComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
