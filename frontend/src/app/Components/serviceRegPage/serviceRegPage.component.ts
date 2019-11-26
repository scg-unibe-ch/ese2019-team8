import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ServiceItem} from '../../_models/service-item';
import {EventServiceComponent} from '../event-service/event-service.component';

@Component({
  selector: 'app-home',
  templateUrl: './serviceRegPage.component.html',
  styleUrls: ['./serviceRegPage.component.scss'],
})

export class ServiceRegPageComponent implements OnInit {
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');


  constructor(
    private httpClient: HttpClient,
    private eventService: EventServiceComponent) {}

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/service', {
      params: new HttpParams().set('serviceItemId', '' + this.serviceItem.id)
    }).subscribe();
  }
  // ToDo: User wird noch nicht mitgegeben?
  clickAddService() {
    this.httpClient.post('http://localhost:3000/service', {
      token: localStorage.getItem('currentUser').replace('"', '').replace('"', ''),
      serviceName: this.serviceItem.serviceName,
      category: this.serviceItem.category,
      price: this.serviceItem.price,
      location: this.serviceItem.location,
      description: this.serviceItem.description,
    }).subscribe((instance: any) => {
      this.serviceItem.user = instance.user;
      this.serviceItem.serviceName = instance.serviceName;
      this.serviceItem.category = instance.category;
      this.serviceItem.price = instance.price;
      this.serviceItem.location = instance.location;
      this.serviceItem.description = instance.description;
    });
  }
}


