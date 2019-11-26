import {Component, OnInit} from '@angular/core';
import {ServiceItem} from '../../_models/service-item';
import {HttpClient} from '@angular/common/http';
import {SearcherComponent} from '../searcher/searcher.component';
import {clickSearch} from '../searcher/searcher.component';
import {EventServiceComponent} from '../event-service/event-service.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');


  constructor(private eventService: EventServiceComponent) {
  }


  ngOnInit() {}
  clickSearch() {}

  clickAllServices() {
  }

}


