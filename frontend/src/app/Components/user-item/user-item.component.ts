import {Component, Input, OnInit} from '@angular/core';
import {UserItem} from './user-item';
import {HttpClient, HttpParams} from '@angular/common/http';


@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent implements OnInit {
  userItem: UserItem;


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

  onUSerItemCreate() {
    this.httpClient.post('http://localhost:3000/user/' + this.userItem.id, {
        username: this.userItem.username,
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


