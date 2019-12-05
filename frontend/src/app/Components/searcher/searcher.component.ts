import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserItem} from '../../_models/user-item';
import {ServiceItem} from '../../_models/service-item';
import {forEach} from '@angular-devkit/schematics';


@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
})
export class SearcherComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  serviceSearchAnyURL = 'http://localhost:3000/service/searchAny/';
  profileURL = 'http://localhost:3000/user/profile/';
  currentUSerServicesURL = 'http://localhost:3000/service/myServices/';
  userItem: UserItem = new UserItem(null, '', false,
    '', '', null, '', null);
  services: ServiceItem[] = [];
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  inputValue: string;
  categories: string[] = ['venue', 'photography', 'catering', 'hotels', 'music', 'stylist', 'decoration', 'planner'];
  category: string;
  randomServices: ServiceItem[] = [];


    ngOnInit() {
  }


  clickSearch() {
    this.closeServices();
    // Searches for service in DB, with all parameters
    this.httpClient.get(this.serviceSearchAnyURL + this.inputValue,
      {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
      });
    this.refresh();
  }

  // TODO: Search for specific user

  getCurrentUserServices() {
    this.closeServices();
    this.httpClient.get(this.currentUSerServicesURL + this.token, {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
    });
  }

  closeServices() {
    this.services = [];
  }

  clickCategorySearch(categoryId) {
    this.services = [];
    this.category = this.categories[categoryId];
    this.httpClient.get(this.serviceSearchAnyURL + this.category, {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
    });
  }

  clickRandomParty() {
      let array;
      let i;
      let randomService;
      array = [0, 2, 4, 7];
      randomService = new ServiceItem(null, '', '', '',
        null, '', '');
      for (i of array) {
          this.clickCategorySearch(array[i]);
          console.log(this.services);
          randomService = this.services[this.randomIndex(this.services)];
          console.log(this.randomServices);
          this.randomServices.push(randomService);
          console.log(this.randomServices);
    }
      this.services.push.apply(this.services, this.randomServices);
      console.log(this.services);
  }

  randomIndex(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  refresh(): void {
    window.location.reload();
  }

}

