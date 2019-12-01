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

  serviceSearchAnyURL = 'http://localhost:3000/service/searchAny/';
  profileURL = 'http://localhost:3000/user/profile/';
  currentUSerServicesURL = 'http://localhost:3000/service/myServices/';
  userItem: UserItem = new UserItem(null, '', false,
    '', '', null, '', null);
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');
  services: ServiceItem[] = [];
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  userServiceView: boolean;
  inputValue: string;
  categories: string[] = ['venue', 'photography', 'catering', 'hotels', 'music', 'planner', 'stylist', 'decoration', 'event planner'];
  category: string;

  ngOnInit() {
  }


  clickSearch() {
    this.services = [];
    // Searches for service in DB, with all parameters
    this.httpClient.get(this.serviceSearchAnyURL + this.inputValue,
    {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
    });
  }

  // TODO: Search for specific user

  getCurrentUserServices() {
    this.services = [];
    this.userServiceView = true;
    this.httpClient.get(this.currentUSerServicesURL + this.token, {
    }).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
    });
  }

  closeServices() {
    this.services = [];
    this.userServiceView = false;
  }

  clickCategorySearch(categoryId) {
    this.userServiceView = false;
    this.services = [];
    this.category = this.categories[categoryId];
    this.httpClient.get(this.serviceSearchAnyURL + this.category, {
    }).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
      });

  }

}

