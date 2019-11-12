import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserItem} from '../user-item';

@Component({
  selector: 'app-home',
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.scss'],
})
export class HomePageComponent implements OnInit {
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);


  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
  }

}


