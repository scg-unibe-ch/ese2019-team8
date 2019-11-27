import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AlertService} from '../../_alert';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserItem} from '../../_models/user-item';
import {ServiceItem} from '../../_models/service-item';


@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
})
export class SearcherComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              private alertService: AlertService,
              private router: Router) {}

  serviceSearchURL = 'http://localhost:3000/service/search';
  profileURL = 'http://localhost:3000/user/profile/';
  currentUSerServicesURL = 'http://localhost:3000/service/myServices/';
  userItem: UserItem = new UserItem(null, '', false,
    '', '', null, '', null);
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');
  services: ServiceItem[] = [];
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  userServiceView: boolean;

  ngOnInit() {
  }

// TODO: useful search
  clickServiceNameSearch() {
    // Searches for service in DB, with all parameters
    this.httpClient.get(this.serviceSearchURL + ' ' + this.serviceItem.serviceName,
    {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
    });
  }

  getCurrentUserServices() {
    this.userServiceView = true;
    this.httpClient.get(this.currentUSerServicesURL + this.token, {
    }).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
    });



  }




  /**
   * TODO: Search with only one Parameter
   * clickCategorySearch()
   */

}

