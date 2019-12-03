import {Component, OnInit, Input} from '@angular/core';
import {UserItem} from '../../_models/user-item';
import {AuthenticationService} from '../../_services';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController, ToastController} from '@ionic/angular';
import {ServiceItem} from '../../_models/service-item';
import {ValidationMessages} from '../../validators/validationMessages';


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
    private alertController: AlertController,
    private toastController: ToastController
  ) {
  }

  @Input()
  profilePageForm: FormGroup;
  user: UserItem;
  profileURL = 'http://localhost:3000/user/profile/';
  currentUSerServicesURL = 'http://localhost:3000/service/myServices/';
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);
  services: ServiceItem[] = [];
  userServiceView: boolean;
  validationMessages = ValidationMessages.validationMessages;
  isAdmin = false;


  ngOnInit() {
    this.httpClient.get(this.profileURL + this.token)
      .subscribe((instance: any) => {
        this.userItem.username = instance.username;
        this.userItem.address = instance.address;
        this.userItem.email = instance.email;
        this.userItem.city = instance.city;
        this.userItem.zip = instance.zip;
        this.userItem.phoneNumber = instance.phoneNumber;
        this.userItem.isServiceProvider = instance.isServiceProvider;
        this.isAdmin = instance.isAdmin;
        // console.log(instance);
      });
    this.profilePageForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
          Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'),
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
          Validators.maxLength(12),
          Validators.minLength(10),
          Validators.pattern('^[0-9]+$'),
        ]
      )),
      // disabled due to errors when changing checkbox state
      // isServiceProvider: new FormControl('')
    });
  }


  save() {
    this.httpClient.put('http://localhost:3000/user/profile', {
      token: this.token,
      // isServiceProvider: this.profilePageForm.value.isServiceProvider,
      email: this.profilePageForm.value.email,
      address: this.profilePageForm.value.address,
      zip: this.profilePageForm.value.zip,
      city: this.profilePageForm.value.city,
      phoneNumber: this.profilePageForm.value.phoneNumber,

    }).subscribe(data => {
        console.log(data);
        this.presentToast('Profile data update successful');
        this.router.navigate(['/profilePage'], {queryParams: {dataUpdated: true}});
      },
      error => {
        this.presentToast(error.error.message);
      });
  }


  logout() {
    this.authService.logout();
  }

  getCurrentUserServices() {
    this.services = [];
    this.userServiceView = true;
    this.httpClient.get(this.currentUSerServicesURL + this.token, {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.null, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));

    });
  }

  closeServices() {
    this.services = [];
    this.userServiceView = false;
  }


  deleteProfile() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        token: this.token
      }
    };
    this.httpClient.delete('http://localhost:3000/user/profile', options).subscribe(data => {
      console.log('User deleted');
      this.logout();
      this.presentToast('User profile successfully deleted');
      this.router.navigate(['/login'], {queryParams: {userDeleted: true}});
    }, error => {
      this.presentToast(error.message);
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

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Do you really want to delete your profile? All services connected to this profile will also be deleted. This action can not be undone!',
      message: '<strong>Yes</strong>, I am sure!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Delete: Profile: CANCELED');
          }
        }, {
          text: 'Delete my profile',
          handler: () => {
            console.log('Delete Profile: Confirmed');
            this.deleteProfile();
          }
        }
      ]
    });

    await alert.present();
  }


}
