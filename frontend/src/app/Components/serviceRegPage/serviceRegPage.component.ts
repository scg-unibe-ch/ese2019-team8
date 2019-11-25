import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ServiceItem} from '../../_models/service-item';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './serviceRegPage.component.html',
  styleUrls: ['./serviceRegPage.component.scss'],
})

export class ServiceRegPageComponent implements OnInit {
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');


  constructor(private httpClient: HttpClient,
              private formBuilder: FormBuilder) {
  }

  serviceForm: FormGroup;

  validationMessages = {
    serviceName: [
      {type: 'required', message: 'Name of service is required.'},
      {type: 'minlength', message: 'Name of Service must be at least 2 characters long.'},
      {type: 'maxlength', message: 'Name of Service cannot be more than 25 characters long.'},
    ],
  };

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
      price: new FormControl(''),
      location: new FormControl(''),
      description: new FormControl(''),
    });
  }

  clickAddService2() {
    this.httpClient.post('http://localhost:3000/service', {
      token: localStorage.getItem('currentUser').replace('"', '').replace('"', ''),
      serviceName: this.serviceForm.value.serviceName,
      category: this.serviceForm.value.category,
      price: this.serviceForm.value.price,
      location: this.serviceForm.value.location,
      description: this.serviceForm.value.description,
    }).subscribe(data => {
        console.log(data);
        // this.alertService.success('Registration successful');
        // alert('Registration successful');
      },
      error => {
        alert(error.error.message);
      });
  }

}


