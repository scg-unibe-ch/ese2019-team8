import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {UserItem} from '../_models/user-item';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
  }

  // TODO: fix this
  getAll() {
    return this.http.get<UserItem[]>('/user');
    // return this.http.get<UserItem[]>('/user/users');
  }
}
