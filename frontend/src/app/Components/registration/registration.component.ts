import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../helpers';
import {Router} from '@angular/router';
import {UsernameValidator} from '../../validators/username.validator';
import {PasswordValidator} from '../../validators/password.validator';
import {UserItem} from '../user-item';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  userItem: UserItem = new UserItem(null, '', false,
    '', '', null, '', null);
  registrationForm: FormGroup;
  passwordCheckerGroup: FormGroup;

  validationMessages = {
    username: [
      {type: 'required', message: 'Username is required.'},
      {type: 'minlength', message: 'Username must be at least 5 characters long.'},
      {type: 'maxlength', message: 'Username cannot be more than 25 characters long.'},
      {type: 'pattern', message: 'Your username must contain only numbers and letters.'},
      {type: 'validUsername', message: 'Your username has already been taken.'}
    ],
    password: [
      {type: 'required', message: 'Password is required.'},
      {type: 'minlength', message: 'Password must be at least 5 characters long.'},
      {type: 'pattern', message: 'Your Password must contain only numbers and letters.'},
    ],
    passwordConfirmation: [
      {type: 'required', message: 'Confirm password is required.'},
      {type: 'areEqual', message: 'Password mismatch'}
    ],
    // more messages
  };

  ngOnInit() {

    this.passwordCheckerGroup = new FormGroup({
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

    this.registrationForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        UsernameValidator.validUsername,
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^[A-Za-z0-9]+$'),
        Validators.required
      ])),
      isServiceProvider: new FormControl(false),
      email: new FormControl(''),
      address: new FormControl(''),
      zip: new FormControl(''),
      city: new FormControl(''),
      phoneNumber: new FormControl(''),
      passwordChecker: this.passwordCheckerGroup
    });

  }

  reset() {
    // this.registrationForm.reset();
    // this.passwordCheckerGroup.reset();
    this.ngOnInit();
  }

  register() {
    // reset alerts on submit
    this.alertService.clear();

    const usernameForm = this.registrationForm.value.username;
    const passwordForm = this.registrationForm.value.passwordChecker.password;
    const isServiceProviderForm = this.registrationForm.value.isServiceProvider;
    const emailForm = this.registrationForm.value.email;
    const addressForm = this.registrationForm.value.address;
    const zipForm = this.registrationForm.value.zip;
    const cityForm = this.registrationForm.value.city;
    const phoneNumberForm = this.registrationForm.value.phoneNumber;

    // console.log(usernameForm, passwordForm, isServiceProviderForm, emailForm, addressForm, zipForm, cityForm, phoneNumberForm);
    if (this.registrationForm.valid) {
      console.log('form submitted');
    } else {
      console.log('not valid');
    }
    this.httpClient.post('http://localhost:3000/user', {
      username: usernameForm,
      password: passwordForm,
      isServiceProvider: isServiceProviderForm,
      email: emailForm,
      address: addressForm,
      zip: zipForm,
      city: cityForm,
      phoneNumber: phoneNumberForm,

    }).subscribe(data => {
        this.alertService.success('Registration successful', true);
        this.router.navigate(['/login'], {queryParams: {registered: true}});
      },
      error => {
        this.alertService.error(error);
      });
  }


}
