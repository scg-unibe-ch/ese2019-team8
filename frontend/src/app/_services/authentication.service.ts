import {Component, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, PartialObserver} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserItem} from '../_models/user-item';



@Injectable({providedIn: 'root'})
export class AuthenticationService {
  isLoggedin = false;
  userItem: UserItem;

  constructor(
    private http: HttpClient,
    private httpClient: HttpClient
    ) {
    this.userItem = new UserItem('', '', false, '',
      '', null, '', null);
  }



  login(username: string, password: string) {
    return this.http.post<any>('http://localhost:3000/user/login', {username, password})
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user.token));
          this.isLoggedin = true;
        }

        return user;
      }));
  }
  // ToDo: get user information
  getUserData() {
   return this.httpClient.get('http://localhost:3000/user/profile/' + localStorage.getItem('currentUser').toString(
    ).replace('\"', '').replace('\"', ''), {
    }).subscribe(data => {
      this.userItem = new UserItem(this.userItem.password, this.userItem.username,
      this.userItem.isServiceProvider, this.userItem.email, this.userItem.address, this.userItem.zip,
      this.userItem.city, this.userItem.phoneNumber);
      },
      error => {
        alert(error.error.message);
      });
  }


  isLoggedIn() {
    if (localStorage.getItem('currentUser') == null) {
      this.isLoggedin = false;
      return this.isLoggedin;
    } else {
      return true;
    }

  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.isLoggedin = false;
  }
}


