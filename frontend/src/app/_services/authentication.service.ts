import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
  private httpClient: HttpClient;
  constructor(private http: HttpClient) {
  }

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

  // ToDo: get user information
  getUserData() {
    // this.httpClient.get('http://localhost:3000/profile/' + localStorage.getItem('currentUser'))

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

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.isLoggedin = false;
  }
}


