import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventServiceComponent} from '../event-service/event-service.component';
import {ToastController} from '@ionic/angular';
import {ServiceItem} from '../../_models/service-item';
import {ValidationMessages} from '../../validators/validationMessages';
import {UserItem} from '../../_models/user-item';

@Component({
  selector: 'app-sevice-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
})
export class ServiceDetailsComponent implements OnInit {
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');
  serviceForm: FormGroup;
  validationMessages = ValidationMessages.validationMessages;
  serviceURL: 'http://localhost:3000/service';
  currentUSerServicesURL = 'http://localhost:3000/service/myServices/';
  userItem: UserItem = new UserItem(null, '', false,
    '', '', null, '', null);
  services: ServiceItem[] = [];
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  category: string;
  constructor(private httpClient: HttpClient,
              private eventService: EventServiceComponent,
              private formBuilder: FormBuilder,
              private toastController: ToastController
  ) {}

  ngOnInit() {

  }

  clickModifyService() {

    this.httpClient.post(this.serviceURL, {
      token: localStorage.getItem('currentUser').replace('"', '').replace('"', ''),
      serviceName: this.serviceForm.value.serviceName,
      category: this.serviceForm.value.category,
      price: this.serviceForm.value.price,
      location: this.serviceForm.value.location,
      description: this.serviceForm.value.description,
    }).subscribe(data => {
        console.log(data);
        this.presentToast('Service created');
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

  clickDeleteService() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        token: this.token,
        serviceId: this.serviceItem.id
      }
    };
    this.httpClient.delete(this.serviceURL, options).subscribe();
  }

}
