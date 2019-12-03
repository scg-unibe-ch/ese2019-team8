import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserItem} from '../../_models/user-item';
import {ToastController} from '@ionic/angular';


@Component({
  selector: 'app-userList',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              private toastController: ToastController) {
  }

  @Input()
  profilePageForm: FormGroup;
  users: UserItem[] = [];
  userURL = 'http://localhost:3000/user/allUsers/';
  userItem: UserItem = new UserItem(null, '');
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');

  ngOnInit() {
    this.httpClient.get(this.userURL + this.token).subscribe((instances: any) => {
      this.users.push.apply(this.users, instances.map((instance) =>
        new UserItem(null, instance.username, instance.isServiceProvider, instance.email
          , instance.address, instance.zip, instance.city, instance.phoneNumber, instance.isApproved)));
    }, error => {
      this.presentToast(error.error.message);
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
