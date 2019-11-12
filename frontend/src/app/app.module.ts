import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

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
import {AlertComponent} from './Components';
import {HomePageComponent} from './Components/homePage/homePage.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    ComponentIonChipComponent,
    RegistrationComponent,
    LoginComponent,
    ProfilePageComponent,
    AlertComponent,
    HomePageComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
