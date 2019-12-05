import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserItem} from '../../_models/user-item';
import {ServiceItem} from '../../_models/service-item';
import {interval} from 'rxjs';
import {timeout} from 'rxjs/operators';
import {AlertController} from '@ionic/angular';


@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
})
export class SearcherComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              private alertController: AlertController) {
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
          , instance.price, instance.location, instance.description, instance.contactMail)));
    });
    // this.refresh();
  }

  // TODO: Search for specific user

  getCurrentUserServices() {
    this.closeServices();
    this.httpClient.get(this.currentUSerServicesURL + this.token, {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.descriptio, instance.contactMail)));
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
          , instance.price, instance.location, instance.description, instance.contactMail)));
    });
  }

  clickRandomParty() {
    let array;
    let i;
    let randomService;
    array = [0, 2, 4, 7];
    randomService = new ServiceItem(null, '', '', '',
      null, '', '', '');
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

  /**
   * Refreshes the page after 4 seconds, so that the Toast alert is displayed first
   */
  refresh(): void {
    interval(4000).pipe(timeout(5000))      // Let's use bigger timespan to be safe,
      // since `interval` might fire a bit later then scheduled.
      .subscribe(
        value => window.location.reload(), // Will emit numbers just as regular `interval` would.
        err => console.log(err),     // Will never be called.
      );
  }


  /**
   * Presents alert with booking details and two buttons. One for cancel and one for copying booking email to clipboard.
   */
  async showBooking(serviceName, email) {
    const alert = await this.alertController.create({
      header: 'Service: ' + serviceName,
      subHeader: 'Booking Details',
      message: 'Contact the service provider: ' + email,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Copy email to clipboard',
          handler: () => {
            // console.log(email);
            this.copyToClipboard(email);
          }
        },
      ]
    });

    await alert.present();
  }

  /**
   * Copies input string to clipboard.
   */
  copyToClipboard(text) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (text));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

}

