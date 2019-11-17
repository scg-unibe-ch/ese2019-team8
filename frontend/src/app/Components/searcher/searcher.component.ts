import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AlertService} from '../../_alert';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserItem} from '../../_models/user-item';
import {ServiceItem} from '../../_models/service-item';


@Component({
  selector: 'app-searchbar',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
})
export class SearcherComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              private alertService: AlertService,
              private router: Router) {}

  userItem: UserItem = new UserItem(null, '', false,
    '', '', null, '', null);
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');


  ngOnInit() {
  }


  /**
   * TODO: Search with only one Parameter
   * clickCategorySearch()
   */

}
export function clickSearch() {
  // Searches for service in DB, with all parameters
  this.httpClient.get('http://localhost:3000/search', {
    params: new HttpParams().set('serviceItemId', '' + this.serviceItem.id + this.serviceItem.user + this.serviceItem.serviceName
      + this.serviceItem.category + this.serviceItem.price + this.serviceItem.location
      + this.serviceItem.description)
  }).subscribe();
}
