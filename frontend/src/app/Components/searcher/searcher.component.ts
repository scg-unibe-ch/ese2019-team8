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
  partyCategories: string[] = ['venue', 'catering', 'music', 'planner'];
  category: string;
  randomServices: ServiceItem[] = [];
  randomPartyView: boolean;


    ngOnInit() {
  }


  clickSearch() {
    this.randomPartyView = false;
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
    this.randomPartyView = false;
    this.services = [];
    this.category = this.categories[categoryId];
    this.httpClient.get(this.serviceSearchAnyURL + this.category, {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
    });
  }

  clickRandomParty() {
    this.randomPartyView = true;
    this.services = [];
    this.httpClient.get('http://localhost:3000/service').subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description)));
      this.services = this.shuffle(this.services);
      let index = 0;
      for (const partyCategory of this.partyCategories) {
        let i = 0;
        for (const serviceItem of this.services) {
          if (serviceItem.category === partyCategory) {
            while (i < 1) {
            this.randomServices[index] = serviceItem;
            index++;
            i++;
          }
        }

      }}
    });
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  refresh(): void {
    window.location.reload();
  }

}

