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
    email: [
      {type: 'pattern', message: 'This is not a valid email address.'}
    ],
    address: [
      {type: 'minlength', message: 'Address must be at least 3 characters long.'},
      {type: 'maxlength', message: 'Address cannot be more than 150 characters long.'},
      {type: 'pattern', message: 'Your Address can only contain letters and numbers..'}
    ],
    zip: [
      {type: 'minlength', message: 'Your zip code must be at least 4 characters long.'},
      {type: 'maxlength', message: 'Your zip code cannot be more than 6 characters long.'},
      {type: 'pattern', message: 'Your zip code can only contain numbers..'}
    ],
    city: [
      {type: 'minlength', message: 'City must be at least 2 characters long.'},
      {type: 'maxlength', message: 'City cannot be more than 25 characters long.'},
      {type: 'pattern', message: 'City can only contain letters.'}
    ],
    phoneNumber: [
      {type: 'minlength', message: 'Phone number must be at least 10 characters long.'},
      {type: 'maxlength', message: 'Phone number cannot be more than 12 characters long.'},
      {type: 'pattern', message: 'Please enter your phone number using only numbers.'}
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
      email: new FormControl('', Validators.compose([
          Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'),
        ]
      )),
      address: new FormControl('', Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(3),
          Validators.pattern('^[A-Za-z0-9]+$')
        ]
      )),
      zip: new FormControl('', Validators.compose([
          Validators.maxLength(6),
          Validators.minLength(4),
          Validators.pattern('^[0-9]+$')
        ]
      )),
      city: new FormControl('', Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(2),
          Validators.pattern('^[A-Za-z]+$')
        ]
      )),
      phoneNumber: new FormControl('', Validators.compose([
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(12),
          Validators.minLength(10),
        ]
      )),
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
