import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../_alert';
import {Router} from '@angular/router';
import {PasswordValidator} from '../../validators/password.validator';
import {UserItem} from '../../_models/user-item';

@Component({
  selector: 'app-change-password-page',
  templateUrl: './change-password-page.component.html',
  styleUrls: ['./change-password-page.component.scss'],
})
export class ChangePasswordPageComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  changePWForm: FormGroup;
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');

  validationMessages = {
    password: [
      {type: 'required', message: 'Password is required.'},
      {type: 'minlength', message: 'Password must be at least 5 characters long.'},
      {
        type: 'pattern',
        message: 'Your password must contain at least one upper case letter, one lower case letter and one number.'
      },
    ],
    passwordConfirmation: [
      {type: 'required', message: 'Confirm password is required.'},
      {type: 'areEqual', message: 'Password mismatch'}
    ],
  };


  ngOnInit() {
    this.changePWForm = this.formBuilder.group({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(100),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      passwordConfirmation: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });
  }


  changePW() {
    console.log(this.changePWForm.value.password)
    this.httpClient.put('http://localhost:3000/user/profile', {
      token: this.token,
      password: this.changePWForm.value.password,
    }).subscribe(data => {
        console.log(data);
        // this.alertService.success('Profile data update successful');
        alert('Password change successful');
        this.router.navigate(['/profilePage'], {queryParams: {passwordChanged: true}});
      },
      error => {
        alert(error.error.message);
      });
  }
}
