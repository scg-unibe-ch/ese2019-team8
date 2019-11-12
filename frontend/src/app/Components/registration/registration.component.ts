import {Component, Input, OnInit} from '@angular/core';
import {UserItem} from '../user-item';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {AlertService} from '../../helpers';
import {Router} from '@angular/router';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  userItem: UserItem = new UserItem(null, '', false,
    '', '', null, '', null);
  validationsForm: FormGroup;
  validationMessage: FormGroup;


  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/user/', {
      params: new HttpParams().set('userName', '' + this.userItem.username)
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
    // reset alerts on submit
    this.alertService.clear();
    this.httpClient.post('http://localhost:3000/user', {
      username: this.userItem.username,
      password: this.userItem.password,
      isServiceProvider: this.userItem.isServiceProvider,
      email: this.userItem.email,
      address: this.userItem.address,
      zip: this.userItem.zip,
      city: this.userItem.city,
      phoneNumber: this.userItem.phoneNumber
    }).subscribe(data => {
        this.alertService.success('Registration successful', true);
        this.router.navigate(['/login'], {queryParams: {registered: true}});
      },
      error => {
        this.alertService.error(error);
      });
  }
}

export class UsernameValidator {
  static validUsername(fc: FormControl) {
    /** hardcoded two existing
     * usernames (“abc123” and “123abc”).
     */
    if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
      return ({validUsername: true});
    } else {
      return null;
    }
  }
}

export class PasswordValidator {
  static areEqual(formGroup: FormGroup) {
    let val;
    let valid = true;

    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = formGroup.controls[key] as FormControl;
        if (val === undefined) {
          val = control.value;
        } else {
          if (val !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }
    if (valid) {
      return null;
    }
    return {
      areEqual: true
    };
  }
}


