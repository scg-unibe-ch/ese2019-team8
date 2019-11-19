import {Component, OnInit} from '@angular/core';
import {UserItem} from '../../_models/user-item';
import {AuthenticationService} from '../../_services';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {

  constructor(
    private authService: AuthenticationService
  ) {
  }

  save() {
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }


}
