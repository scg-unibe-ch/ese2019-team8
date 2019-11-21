import {Component, OnInit, Input} from '@angular/core';
import {UserItem} from '../../_models/user-item';
import {AuthenticationService} from '../../_services';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private httpClient: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  @Input()
  profilePageForm: FormGroup;
  user: UserItem;
  url1 = 'http://localhost:3000/user/profile/';
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);

  ngOnInit() {

    // console.log('hoi');
    this.httpClient.get(this.url1 + localStorage.getItem('currentUser').replace('"', '').replace('"', ''))
      .subscribe((instance: any) => {
        // this.user = instances.map((instance) => new userItem(instance.username, instance.email, instance.zip));
        this.userItem.username = instance.username;
        this.userItem.address = instance.address;
        this.userItem.email = instance.email;
        this.userItem.city = instance.city;
        this.userItem.zip = instance.zip;
        this.userItem.phoneNumber = instance.phoneNumber;
        // console.log(instance);
      });
    // console.log(this.userItem);
    this.profilePageForm = this.formBuilder.group({
      email: new FormControl(''),
      password: new FormControl('pw1234'),
    });
  }


  save() {
  }


  logout() {
    this.authService.logout();
  }

  getUserData() {
    // console.log(this.authService.getUserData());
    // return this.authService.getUserData();
  }


}
