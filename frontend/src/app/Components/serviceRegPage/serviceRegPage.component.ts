import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ServiceItem} from '../../_models/service-item';

@Component({
  selector: 'app-home',
  templateUrl: './serviceRegPage.component.html',
  styleUrls: ['./serviceRegPage.component.scss'],
})

export class ServiceRegPageComponent implements OnInit {
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');


  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/service', {
      params: new HttpParams().set('serviceItemId', '' + this.serviceItem.id)
    }).subscribe();
  }
  clickAddService() {
    this.httpClient.post('http://localhost:3000/service', {
      headers: undefined,
      observe: 'body',
      params: new HttpParams().set('serviceItemId', '' + this.serviceItem.user + this.serviceItem.serviceName
        + this.serviceItem.category + this.serviceItem.price + this.serviceItem.location
        + this.serviceItem.description
      ),
      reportProgress: true,
      responseType: 'json',
      withCredentials: false
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


