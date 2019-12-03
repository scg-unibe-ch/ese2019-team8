import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UsernameValidator} from '../../validators/username.validator';
import {PasswordValidator} from '../../validators/password.validator';
import {UserItem} from '../../_models/user-item';
import {ValidationMessages} from '../../validators/validationMessages';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {
  }

  userItem: UserItem = new UserItem(null, '', false,
    '', '', null, '', null);
  registrationForm: FormGroup;
  passwordCheckerGroup: FormGroup;
  validationMessages = ValidationMessages.validationMessages;

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
          Validators.required,
        ]
      )),
      address: new FormControl('', Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(3),
          Validators.pattern('^[A-Za-z0-9\\s]+$')
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
          Validators.pattern('^[A-Za-z\\s]+$')
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
    /*
    if (this.registrationForm.valid) {
      console.log('form valid');
    } else {
      console.log('not valid');
    }
     */
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
        // console.log(data);
        this.presentToast('Registration successful');
        this.router.navigate(['/login'], {queryParams: {registered: true}});
      },
      error => {
        this.presentToast(error.error.message);
      });
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }
}


