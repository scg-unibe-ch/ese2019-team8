import {Component, OnInit, Input} from '@angular/core';
import {UserItem} from '../../_models/user-item';
import {AuthenticationService} from '../../_services';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AlertService} from '../../_alert';

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
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
  }

  @Input()
  profilePageForm: FormGroup;
  user: UserItem;
  profileURL = 'http://localhost:3000/user/profile/';
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);

  ngOnInit() {

    // console.log('hoi');
    this.httpClient.get(this.profileURL + this.token)
      .subscribe((instance: any) => {
        // this.user = instances.map((instance) => new userItem(instance.username, instance.email, instance.zip));
        this.userItem.username = instance.username;
        // this.userItem.password = instance.password;
        this.userItem.address = instance.address;
        this.userItem.email = instance.email;
        this.userItem.city = instance.city;
        this.userItem.zip = instance.zip;
        this.userItem.phoneNumber = instance.phoneNumber;
        this.userItem.isServiceProvider = instance.isServiceProvider;
        console.log(instance);
      });
    // console.log(this.userItem);
    this.profilePageForm = this.formBuilder.group({
      email: new FormControl(''),
      password: new FormControl(''),
      address: new FormControl(''),
      zip: new FormControl(''),
      city: new FormControl(''),
      phoneNumber: new FormControl(''),
      isServiceProvider: new FormControl('')
    });
  }


  save() {
    // reset alerts on submit
    this.alertService.clear();
    /*
    if (this.profilePageForm.valid) {
      console.log('form valid');
    } else {
      console.log('not valid');
    }
     */
    this.httpClient.put('http://localhost:3000/user/profile', {
      token: this.token,
      // password: this.profilePageForm.value.password,
      isServiceProvider: this.profilePageForm.value.isServiceProvider,
      email: this.profilePageForm.value.email,
      address: this.profilePageForm.value.address,
      zip: this.profilePageForm.value.zip,
      city: this.profilePageForm.value.city,
      phoneNumber: this.profilePageForm.value.phoneNumber,

    }).subscribe(data => {
        console.log(data);
        // this.alertService.success('Profile data update successful');
        alert('Profile data update successful');
        this.router.navigate(['/profilePage'], {queryParams: {dataUpdated: true}});
      },
      error => {
        alert(error.error.message);
      });
  }


  logout() {
    this.authService.logout();
  }

  getUserData() {
    // console.log(this.authService.getUserData());
    // return this.authService.getUserData();
  }


}
