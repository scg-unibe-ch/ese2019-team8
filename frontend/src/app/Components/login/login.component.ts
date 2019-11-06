import { Component, OnInit } from '@angular/core';
import {UserItem} from '../user-item';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/login', {
      params: new HttpParams().set('userItemId', '' + this.userItem.id)
    }).subscribe();
  }


    clickLogin() {
      this.httpClient.get('http://localhost:3000/user', {
        headers: undefined,
        observe: 'body',
        params: new HttpParams().set('userItemId', '' + this.userItem.username + this.userItem.password),
        reportProgress: true,
        responseType: 'json',
        withCredentials: false
      }).subscribe((instance: any) => {
        this.userItem.username = instance.username;
        this.userItem.password = instance.password;
      });
    }

}
