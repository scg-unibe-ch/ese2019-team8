import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';

import {TodoListComponent} from './Components/todo-list/todo-list.component';
import {TodoItemComponent} from './Components/todo-list/todo-item/todo-item.component';

import {ComponentIonChipComponent} from './Components/ion-chip/component-ion-chip.component';
import {RegistrationComponent} from './Components/registration/registration.component';
import {LoginComponent} from './Components/login/login.component';
import {ProfilePageComponent} from './Components/profile-page/profile-page.component';
import {AppRoutingModule} from './app-routing.module';
import {HomePageComponent} from './Components/home-page/home-page.component';
import {ServiceRegPageComponent} from './Components/serviceRegPage/serviceRegPage.component';
import {AlertModule} from './_alert';

import {AuthGuard} from './_guards';
import { JwtInterceptor} from './_helpers';
import {AuthenticationService, UserService} from './_services';
import {SearcherComponent} from './Components/searcher/searcher.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    ComponentIonChipComponent,
    RegistrationComponent,
    LoginComponent,
    ServiceRegPageComponent,
    ProfilePageComponent,
    HomePageComponent,
    SearcherComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AlertModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
