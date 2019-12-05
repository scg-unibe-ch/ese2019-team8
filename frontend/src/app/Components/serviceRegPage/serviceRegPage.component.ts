import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ServiceItem} from '../../_models/service-item';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventServiceComponent} from '../event-service/event-service.component';
import {ValidationMessages} from '../../validators/validationMessages';
import {ToastController} from '@ionic/angular';

import {interval} from 'rxjs';
import {timeout} from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './serviceRegPage.component.html',
  styleUrls: ['./serviceRegPage.component.scss'],
})

export class ServiceRegPageComponent implements OnInit {
  serviceItem: ServiceItem = new ServiceItem(null, '', '', '', null, '', '');
  serviceForm: FormGroup;
  validationMessages = ValidationMessages.validationMessages;

  constructor(private httpClient: HttpClient,
              private eventService: EventServiceComponent,
              private formBuilder: FormBuilder,
              private toastController: ToastController
  ) {}

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/service', {
      params: new HttpParams().set('serviceItemId', '' + this.serviceItem.id)
    }).subscribe();
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


  clickAddService() {
    console.log(this.serviceForm.value.category);
    this.httpClient.post('http://localhost:3000/service', {
      token: localStorage.getItem('currentUser').replace('"', '').replace('"', ''),
      serviceName: this.serviceForm.value.serviceName,
      category: this.serviceForm.value.category,
      price: this.serviceForm.value.price,
      location: this.serviceForm.value.location,
      description: this.serviceForm.value.description,
    }).subscribe(data => {
        console.log(data);
        this.presentToast('Service created');
        // this.refresh();
      },
      error => {
        this.presentToast(error.error.message);
      });
  }

  refresh(): void {
    interval(4000).pipe(timeout(5000))      // Let's use bigger timespan to be safe,
      // since `interval` might fire a bit later then scheduled.
      .subscribe(
        value => window.location.reload(), // Will emit numbers just as regular `interval` would.
        err => console.log(err),     // Will never be called.
      );
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


