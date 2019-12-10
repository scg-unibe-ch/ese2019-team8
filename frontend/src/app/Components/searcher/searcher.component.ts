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

  serviceSearchAnyURL = 'http://localhost:3000/service/searchAny/';
  profileURL = 'http://localhost:3000/user/profile/';
  userItem: UserItem = new UserItem(null, '', false,
    '', '', null, '', null);
  services: ServiceItem[] = [];
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  inputValue: string;
  categories: string[] = ['venue', 'photography', 'catering', 'hotels', 'music', 'stylist', 'decoration', 'planner'];
  partyCategories: string[] = ['venue', 'catering', 'music', 'decoration', 'planner'];
  category: string;
  randomServices: ServiceItem[] = [];
  randomPartyView: boolean;
  searchResultView: boolean;
  randomServiceView: boolean;

  constructor(private httpClient: HttpClient,
              private alertController: AlertController) {
  }

  ngOnInit() {
    this.httpClient.get(this.profileURL + this.token)
      .subscribe((instance: any) => {
        // this.user = instances.map((instance) => new userItem(instance.username, instance.email, instance.zip));
        this.userItem.username = instance.username;
        this.userItem.isServiceProvider = instance.isServiceProvider;
      });
  }


  clickSearch() {
    this.searchResultView = true;
    this.randomPartyView = false;
    this.randomServiceView = false;
    this.services = [];
    this.randomServices = [];
    // Searches for service in DB, with all parameters
    this.httpClient.get(this.serviceSearchAnyURL + this.inputValue,
      {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description, instance.contactMail)));
      console.log(this.services.length);
      console.log(this.category);
      console.log(this.inputValue);
    });
    // this.refresh();
  }


  closeServices() {
    this.randomPartyView = false;
    this.searchResultView = false;
    this.randomServiceView = false;
    this.services = [];
    this.randomServices = [];
  }

  clickCategorySearch(categoryId) {
    this.searchResultView = true;
    this.randomPartyView = false;
    this.randomServiceView = false;
    this.services = [];
    this.randomServices = [];
    this.category = this.categories[categoryId];
    this.httpClient.get(this.serviceSearchAnyURL + this.category, {}).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description, instance.contactMail)));
    });
  }

  clickRandomParty() {
    this.randomPartyView = true;
    this.searchResultView = false;
    this.randomServiceView = false;
    this.services = [];
    this.randomServices = [];
    this.httpClient.get('http://localhost:3000/service').subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description, instance.contactMail)));
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

        }
      }
    });
  }

  clickRandomService() {
    this.searchResultView = false;
    this.randomPartyView = false;
    this.randomServiceView = true;
    this.services = [];
    this.randomServices = [];
    this.httpClient.get('http://localhost:3000/service').subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description, instance.contactMail)));
      this.services = this.shuffle(this.services);
      let randomService;
      randomService = this.randomItem(this.services);
      this.services = [];
      this.services.push(randomService);
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

