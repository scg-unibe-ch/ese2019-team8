import {Component, Input, OnInit} from '@angular/core';
import {ServiceItem} from '../../_models/service-item';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserItem} from '../../_models/user-item';


@Component({
  selector: 'app-event-service',
  templateUrl: './event-service.component.html',
  styleUrls: ['./event-service.component.scss'],
})
export class EventServiceComponent implements OnInit {

  constructor(private httpClient: HttpClient) {
  }

  @Input()
  profilePageForm: FormGroup;
  services: ServiceItem[] = [];
  currentUserServices: ServiceItem[] = [];
  serviceURL = 'http://localhost:3000/service';
  profileURL = 'http://localhost:3000/user/profile/';
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');


  ngOnInit() {
    this.httpClient.get(this.serviceURL).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
       });
  }
}
