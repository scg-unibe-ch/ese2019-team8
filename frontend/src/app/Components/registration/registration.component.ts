import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../_alert';
import {Router} from '@angular/router';
import {UsernameValidator} from '../../validators/username.validator';
import {PasswordValidator} from '../../validators/password.validator';
import {UserItem} from '../../_models/user-item';

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
      {type: 'pattern', message: 'Your username can only contain letters and numbers..'},
      {type: 'validUsername', message: 'Your username has already been taken.'}
    ],
    // TODO: PW Messages
    password: [
      {type: 'required', message: 'Password is required.'},
      {type: 'minlength', message: 'Password must be at least 5 characters long.'},
      {type: 'pattern', message: 'Your username must contain at least one upper case letter, one lower case letter and one number.'},
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
// as
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
    if (this.registrationForm.valid) {
      console.log('form valid');
    } else {
      console.log('not valid');
    }
    this.httpClient.post('http://localhost:3000/user', {
      username: this.registrationForm.value.username,
      password: this.registrationForm.value.passwordChecker.password,
      isServiceProvider: this.registrationForm.value.isServiceProvider,
      email: this.registrationForm.value.email,
      address: this.registrationForm.value.address,
      zip: this.registrationForm.value.zip,
      city: this.registrationForm.value.city,
      phoneNumber: this.registrationForm.value.phoneNumber,

    }).subscribe(data => {
        console.log(data);
        // this.alertService.success('Registration successful');
        alert('Registration successful');
        this.router.navigate(['/login'], {queryParams: {registered: true}});
      },
      error => {
        alert(error.error.message);
      });
  }


}
