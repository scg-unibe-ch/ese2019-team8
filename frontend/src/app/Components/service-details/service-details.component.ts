import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {ToastController} from '@ionic/angular';
import {ServiceItem} from '../../_models/service-item';
import {ValidationMessages} from '../../validators/validationMessages';
import {UserItem} from '../../_models/user-item';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
})
export class ServiceDetailsComponent implements OnInit {


  constructor(private httpClient: HttpClient,
              private formBuilder: FormBuilder,
              private toastController: ToastController
  ) {}

  serviceItem: ServiceItem = new ServiceItem(null, '', '', '', null, '', '');
  serviceForm: FormGroup;
  validationMessages = ValidationMessages.validationMessages;
  userItem: UserItem = new UserItem(null, '', false,
    '', '', null, '', null);
  services: ServiceItem[] = [];
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  modificationView: boolean;

  ngOnInit() {
    this.services = [];
    this.httpClient.get('http://localhost:3000/service/myServices/' + this.token, {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
    });
    // Creation of form
    this.serviceForm = this.formBuilder.group({
      serviceName: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(2),
        Validators.required
      ])),
      serviceCategory: new FormControl(''),
      price: new FormControl('', Validators.compose([
          Validators.max(999999999),
          Validators.pattern('^[0-9]+$')
        ]
      )),
      location: new FormControl('', Validators.compose([
        Validators.maxLength(50),
        Validators.minLength(2),
        Validators.pattern('^[A-Za-z0-9\\s]+$')
      ])),
      description: new FormControl(''),
    });
  }

  getOnlyThisService(serviceId) {
    this.modificationView = true;
    this.httpClient.get('http://localhost:3000/service/id=' + serviceId).
    subscribe((instance: any) => {
      this.serviceItem.id = instance.id;
      this.serviceItem.user = instance.user;
      this.serviceItem.serviceName = instance.serviceName;
      this.serviceItem.category = instance.category;
      this.serviceItem.price = instance.price;
      this.serviceItem.location = instance.location;
      this.serviceItem.description = instance.description;
    });
  }

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
      },
      error => {
        this.presentToast(error.error.message);
      });
    this.refresh();
  }


  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }

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
    this.httpClient.delete('http://localhost:3000/service', options).subscribe();
  }
  refresh(): void {
    window.location.reload();
  }
}
