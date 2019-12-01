import {Component, OnInit} from '@angular/core';
import {UserItem} from '../../_models/user-item';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {first} from 'rxjs/operators';

import {User} from '../../../../../backend/app/models/user.model';
import {UserService} from '../../_services';
import {AuthenticationService} from '../../_services';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);
  users: UserItem[] = [];
  loading = false;


  constructor(private httpClient: HttpClient,
              private router: Router,
              private userService: UserService,
              private authenticationService: AuthenticationService,
              private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.httpClient.post('http://localhost:3000/user/createAdmin', {}).subscribe(data => {
      // console.log(data);
    });
    /*
    // TODO: fix get method
    // get users from secure api end point
    this.userService.getAll()
      .pipe(first())
      .subscribe(users => {
        this.users = users;
      });
     */
    // reset login status
    this.authenticationService.logout();
  }


  clickLogin() {
    this.loading = true;
    this.authenticationService.login(this.userItem.username, this.userItem.password)
      .pipe(first())
      .subscribe(
        data => {
          // console.log(data.message);
          this.presentToast(data.message);
          this.router.navigate(['/home'], {queryParams: {login: true}});
          console.log(JSON.parse(localStorage.getItem('currentUser')));
        },
        error => {
          this.presentToast(error.error.message);
          this.loading = false;
        });
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }
}
