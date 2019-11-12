import {Component, OnInit} from '@angular/core';
import {ServiceItem} from '../service-item';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  serviceItem: ServiceItem = new ServiceItem('', '', '', null, '', '');


  constructor() {
  }

  ngOnInit() {
  }
}
