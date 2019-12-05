import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserItem} from '../../_models/user-item';
import {AlertController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {interval} from 'rxjs';
import {timeout} from 'rxjs/operators';


@Component({
  selector: 'app-userList',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              private toastController: ToastController,
              private alertController: AlertController,
              private router: Router) {
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

  approve(username, approve) {
    this.httpClient.put('http://localhost:3000/user/admin', {
      token: this.token,
      username,
      isApproved: approve,
    }).subscribe(data => {
        console.log(data);
        this.presentToast('User status changed');
        this.refresh();
        // this.router.navigate(['/profilePage'], {queryParams: {dataUpdated: true}});
      },
      error => {
        this.presentToast(error.error.message);
      });

  }

  deleteUser(usernameToBeDeleted) {
    // console.log(usernameToBeDeleted);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        token: this.token,
        username: usernameToBeDeleted
      }
    };
    this.httpClient.delete('http://localhost:3000/user/admin', options).subscribe(data => {
      // console.log('User deleted');
      this.presentToast('User profile successfully deleted');
      this.refresh();
    }, error => {
      this.presentToast(error.message);
    });
  }


  async presentAlertConfirm(usernameToBeDeleted) {
    const alert = await this.alertController.create({
      header: 'Do you really want to delete ' + usernameToBeDeleted + '\'s profile? All services connected to this profile will also be deleted. This action can not be undone!',
      message: '<strong>Yes</strong>, I am sure!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Delete: Profile: CANCELED');
          }
        }, {
          text: 'Delete ' + usernameToBeDeleted,
          handler: () => {
            console.log('Delete Profile: Confirmed');
            this.deleteUser(usernameToBeDeleted);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }

  isAdmin(username) {
    return (username === 'admin1');
  }

  refresh(): void {
    interval(4000).pipe(timeout(5000))      // Let's use bigger timespan to be safe,
      // since `interval` might fire a bit later then scheduled.
      .subscribe(
        value => window.location.reload(), // Will emit numbers just as regular `interval` would.
        err => console.log(err),     // Will never be called.
      );
  }
}
