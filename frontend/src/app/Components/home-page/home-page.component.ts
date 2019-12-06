import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EventServiceComponent} from '../event-service/event-service.component';
import {UserItem} from '../../_models/user-item';
import {ServiceItem} from '../../_models/service-item';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  services: ServiceItem[] = [];
  serviceURL = 'http://localhost:3000/service';
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');
  userItem: UserItem = new UserItem(null, '', false, '', '', null, '', null);
  profileURL = 'http://localhost:3000/user/profile/';
  isAdmin = false;

  constructor(private eventService: EventServiceComponent,
              private httpClient: HttpClient,
              private alertController: AlertController) {
  }

  /**
   * Checks currently logged in user and sets parameters if admin and if serivice procider accordingly.
   */
  ngOnInit() {
    this.httpClient.get(this.profileURL + this.token)
      .subscribe((instance: any) => {
        // this.user = instances.map((instance) => new userItem(instance.username, instance.email, instance.zip));
        this.userItem.username = instance.username;
        this.userItem.isServiceProvider = instance.isServiceProvider;
      });
    this.httpClient.get(this.profileURL + this.token)
      .subscribe((instance: any) => {
        // console.log('is admin:' + instance.isAdmin);
        this.isAdmin = instance.isAdmin;
      });
    this.httpClient.get(this.serviceURL).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description, instance.contactMail)));
      this.shuffle(this.services);
      this.services.splice(4, this.services.length);
    });

  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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




