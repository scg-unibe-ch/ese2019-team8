import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {AlertController, ToastController} from '@ionic/angular';
import {ServiceItem} from '../../_models/service-item';
import {ValidationMessages} from '../../validators/validationMessages';
import {UserItem} from '../../_models/user-item';
import {interval} from 'rxjs';
import {timeout} from 'rxjs/operators';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
})
export class ServiceDetailsComponent implements OnInit {


  constructor(private httpClient: HttpClient,
              private formBuilder: FormBuilder,
              private toastController: ToastController,
              private alertController: AlertController
  ) {
  }

  serviceItem: ServiceItem = new ServiceItem(null, '', '', '', null, '', '', '');
  serviceForm: FormGroup;
  validationMessages = ValidationMessages.validationMessages;
  userItem: UserItem = new UserItem(null, '', false,
    '', '', null, '', null);
  services: ServiceItem[] = [];
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  modificationView: boolean;

  /**
   * Get method to pull service entries from db. Also creates form for services.
   */
  ngOnInit() {
    this.services = [];
    this.httpClient.get('http://localhost:3000/service/myServices/' + this.token, {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description, instance.contactMail)));
    });
    // Creation of form
    this.serviceForm = this.formBuilder.group({
      serviceName: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(2),
        Validators.required
      ])),
      category: new FormControl(''),
      price: new FormControl('', Validators.compose([
          Validators.max(999999999),
          Validators.pattern('^[0-9]+$')
        ]
      )),
      location: new FormControl('', Validators.compose([
        Validators.maxLength(50),
        Validators.minLength(2),
        Validators.pattern('^[A-Za-z0-9\\säÄöÖüÜß\\-]+$')
      ])),
      description: new FormControl(''),
    });
  }

  /**
   * Gets details from single service from db with get method.
   */
  getOnlyThisService(serviceId) {
    this.modificationView = true;
    this.httpClient.get('http://localhost:3000/service/id=' + serviceId).subscribe((instance: any) => {
      this.serviceItem.id = instance.id;
      this.serviceItem.user = instance.user;
      this.serviceItem.serviceName = instance.serviceName;
      this.serviceItem.category = instance.category;
      this.serviceItem.price = instance.price;
      this.serviceItem.location = instance.location;
      this.serviceItem.description = instance.description;
      this.serviceItem.contactMail = instance.contactMail
    });
  }

  /**
   * Takes data from FormControl and writes them into the db with put method.
   */
  clickModifyService(serviceId) {
    this.modificationView = false;
    this.httpClient.put('http://localhost:3000/service', {
      token: localStorage.getItem('currentUser').replace('"', '').replace('"', ''),
      id: serviceId,
      serviceName: this.serviceForm.value.serviceName,
      category: this.serviceForm.value.category,
      price: this.serviceForm.value.price,
      location: this.serviceForm.value.location,
      description: this.serviceForm.value.description,
    }).subscribe(data => {
        console.log(data);
        this.presentToast('Service modified');
        this.refresh();
      },
      error => {
        this.presentToast(error.error.message);
      });
  }

  /**
   * Presents toast with confirmation feature, so no deletions happen on accident.
   */
  async deleteServiceAlert(serviceId, serviceName) {
    const alert = await this.alertController.create({
      header: 'Do you really want to delete ' + serviceName + '? This action can not be undone!',
      message: '<strong>Yes</strong>, I am sure!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Delete: Service: CANCELED');
          }
        }, {
          text: 'Delete ' + serviceName,
          handler: () => {
            console.log('Delete Service: Confirmed');
            this.clickDeleteService(serviceId);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }

  /**
   * Deletes single service with parameter serviceID
   */
  clickDeleteService(serviceId) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        token: this.token,
        id: serviceId
      }
    };
    this.httpClient.delete('http://localhost:3000/service', options).subscribe(data => {
      // console.log('Service deleted');
      this.presentToast('Service successfully deleted');
      this.refresh();
    }, error => {
      this.presentToast(error.message);
    });
  }

  /**
   * Refreshes the page after 4 seconds, so that the Toast alert is displayed first
   */
  refresh(): void {
    interval(4000).pipe(timeout(5000))      // Let's use bigger timespan to be safe,
      // since `interval` might fire a bit later then scheduled.
      .subscribe(
        value => window.location.reload(), // Will emit numbers just as regular `interval` would.
        err => console.log(err),     // Will never be called.
      );
  }
}
