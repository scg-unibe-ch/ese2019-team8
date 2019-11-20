import { Component, OnInit } from '@angular/core';
import {ServiceItem} from '../../_models/service-item';
import {HttpClient} from '@angular/common/http';
import {AlertService} from '../../_alert';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-event-service',
  templateUrl: './event-service.component.html',
  styleUrls: ['./event-service.component.scss'],
})
export class EventServiceComponent implements OnInit {

  constructor( private httpClient: HttpClient,
               private alertService: AlertService,
               private router: Router,
               private formBuilder: FormBuilder) {
  }
  eventServiceForm: FormGroup;
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');


// ToDo: get real user info is hardcoded for now
  ngOnInit() {
    this.eventServiceForm = this.formBuilder.group({
      username: new FormControl('UsernameXY'),
      serviceName: new FormControl('Service Name'),
      category: new FormControl('Category'),
      price: new FormControl('Price'),
      location: new FormControl('location'),
      description: new FormControl('Long Description of your service.')
  });
  }
}
