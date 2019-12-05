import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {UserItem} from '../_models/user-item';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  isLoggedin = false;
  userItem: UserItem;

  constructor(
    private http: HttpClient
    ) {
    this.userItem = new UserItem('', '', false, '',
      '', null, '', null);
  }

  /**
   * Tries to log in user with post request. If successful, enters token into local storage.
   */
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

  /**
   * Checks if local storage contains userdata and therefore if a user is logged in.
   */
  isLoggedIn() {
    if (localStorage.getItem('currentUser') == null) {
      this.isLoggedin = false;
      return this.isLoggedin;
    } else {
      return true;
    }

  }

  /**
   * Removes user from local storage to log user out.
   */
  logout() {
    localStorage.removeItem('currentUser');
    this.isLoggedin = false;
  }
}


