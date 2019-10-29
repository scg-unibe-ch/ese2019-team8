import {Component, Input, OnInit} from '@angular/core';
import {UserItem} from './user-item';
import {HttpClient, HttpParams} from '@angular/common/http';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/user/', {
      params: new HttpParams().set('userItemId', '' + this.userItem.id)
    }).subscribe();
  }

  onSave() {
    this.httpClient.put('http://localhost:3000/user/' + this.userItem.id, {
      username: this.userItem.username,
      isServiceProvider: this.userItem.isServiceProvider,
      email: this.userItem.email,
      address: this.userItem.address,
      zip: this.userItem.zip,
      city: this.userItem.city,
      phoneNumber: this.userItem.phoneNumber
    }).subscribe();
  }

  clickRegistration() {
    this.httpClient.post('http://localhost:3000/user', {
        username: this.userItem.username,
        password: this.userItem.password,
        isServiceProvider: this.userItem.isServiceProvider,
        email: this.userItem.email,
        address: this.userItem.address,
        zip: this.userItem.zip,
        city: this.userItem.city,
        phoneNumber: this.userItem.phoneNumber
      }).subscribe((instance: any) => {
        this.userItem.id = instance.id;
    });
  }
}


