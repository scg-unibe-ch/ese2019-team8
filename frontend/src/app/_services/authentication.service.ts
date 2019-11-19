import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) {}
  isLoggedin = false;

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

getUserData() {
  // get current user Token
  localStorage.getItem('currentUser');
}


    isLoggedIn() {
    if (localStorage.getItem('currentUser') == null) {
      this.isLoggedin = false;
      return this.isLoggedin;
    } else {
      return true;
    }

  }
}
export function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  this.isLoggedin = false;
}
