import {Component, OnInit} from '@angular/core';
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
  ) {}
  profilePageForm: FormGroup;

  ngOnInit() {
    this.profilePageForm = this.formBuilder.group({
      username: new FormControl(this.getUserData()),
      email: new FormControl('email@gmail.com'),
      password: new FormControl('pw1234'),
    });
  }


  save() {
  }



  logout() {
    this.authService.logout();
  }
  getUserData() {
    console.log(this.authService.getUserData());
    return this.authService.getUserData();
  }


}
