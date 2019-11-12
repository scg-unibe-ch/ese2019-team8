import {Component, OnInit} from '@angular/core';
import {UserItem} from '../user-item';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AlertService} from '../../helpers';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);

  constructor(private httpClient: HttpClient,
              private alertService: AlertService,
              private router: Router
  ) {
  }

  ngOnInit() {
  }


  clickLogin() {
    // reset alerts on submit
    this.alertService.clear();
    this.httpClient.post('http://localhost:3000/user/login', {
      username: this.userItem.username,
      password: this.userItem.password
    }).subscribe(data => {
        this.alertService.success('Login successful', true);
        this.router.navigate(['/home'], {queryParams: {login: true}});
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

}
