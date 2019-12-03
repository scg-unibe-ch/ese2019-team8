import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ServiceItem} from '../../_models/service-item';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventServiceComponent} from '../event-service/event-service.component';
import {ValidationMessages} from '../../validators/validationMessages';
import {ToastController} from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: './serviceRegPage.component.html',
  styleUrls: ['./serviceRegPage.component.scss'],
})

export class ServiceRegPageComponent implements OnInit {
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');
  serviceForm: FormGroup;
  validationMessages = ValidationMessages.validationMessages;
  constructor(private httpClient: HttpClient,
              private eventService: EventServiceComponent,
              private formBuilder: FormBuilder,
              private toastController: ToastController
  ) {}

  // ToDo: A Form to validate if The Price is a number




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


  clickAddService() {
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


