import {Component, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {UserItem} from './_models/user-item';
import {HttpClient} from '@angular/common/http';

import {AuthenticationService} from './_services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);
  profileURL = 'http://localhost:3000/user/profile/';
  token: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private httpClient: HttpClient,
    private authService: AuthenticationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
  }

  loggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }

  isServiceProvider() {
    if (this.loggedIn()) {
      this.token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
      this.httpClient.get(this.profileURL + this.token)
        .subscribe((instance: any) => {
          this.userItem.username = instance.username;
          this.userItem.isServiceProvider = instance.isServiceProvider;
        });
    }
    return this.userItem.isServiceProvider;
  }

}
