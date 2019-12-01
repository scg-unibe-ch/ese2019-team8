import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../_alert';
import {Router} from '@angular/router';
import {PasswordValidator} from '../../validators/password.validator';
import {ValidationMessages} from '../../validators/validationMessages';
import {ToastController} from '@ionic/angular';

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
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {
  }

  changePWForm: FormGroup;
  passwordCheckerGroup: FormGroup;
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
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
    this.changePWForm = this.formBuilder.group({
      passwordChecker: this.passwordCheckerGroup
    });
  }


  changePW() {
    console.log(this.changePWForm.value.passwordChecker.password);
    this.httpClient.put('http://localhost:3000/user/profile', {
      token: this.token,
      password: this.changePWForm.value.passwordChecker.password,
    }).subscribe(data => {
        console.log(data);
        this.presentToast('Password change successful');
        this.router.navigate(['/profilePage'], {queryParams: {passwordChanged: true}});
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
