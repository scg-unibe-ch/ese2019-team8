import {Component, OnInit} from '@angular/core';
import {ServiceItem} from '../../_models/service-item';
import {HttpClient} from '@angular/common/http';
import {SearcherComponent} from '../searcher/searcher.component';
import {EventServiceComponent} from '../event-service/event-service.component';
import {UserItem} from '../../_models/user-item';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  searchValue: string;
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);
  profileURL = 'http://localhost:3000/user/profile/';

  constructor(private eventService: EventServiceComponent,
              private httpClient: HttpClient) {
  }

  isAdmin = false;

  ngOnInit() {
    this.httpClient.get(this.profileURL + this.token)
      .subscribe((instance: any) => {
        // this.user = instances.map((instance) => new userItem(instance.username, instance.email, instance.zip));
        this.userItem.username = instance.username;
        this.userItem.isServiceProvider = instance.isServiceProvider;
      });
    this.httpClient.get(this.profileURL + this.token)
      .subscribe((instance: any) => {
        console.log('is admin:' + instance.isAdmin);
        this.isAdmin = instance.isAdmin;
      });
  }


}


