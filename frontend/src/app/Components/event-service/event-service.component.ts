import {Component, Input, OnInit} from '@angular/core';
import {ServiceItem} from '../../_models/service-item';
import {HttpClient} from '@angular/common/http';
import {FormGroup} from '@angular/forms';
import {UserItem} from '../../_models/user-item';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-event-service',
  templateUrl: './event-service.component.html',
  styleUrls: ['./event-service.component.scss'],
})
export class EventServiceComponent implements OnInit {

  @Input()
  profilePageForm: FormGroup;
  services: ServiceItem[] = [];
  serviceURL = 'http://localhost:3000/service';
  userItem: UserItem = new UserItem(null, '');
  token = localStorage.getItem('currentUser').replace('"', '').replace('"', '');

  constructor(private httpClient: HttpClient,
              private alertController: AlertController) {
  }

  ngOnInit() {
    this.httpClient.get(this.serviceURL).subscribe((instances: any) => {
      this.services.push.apply(this.services, instances.map((instance) =>
        new ServiceItem(instance.id, instance.user, instance.serviceName, instance.category
          , instance.price, instance.location, instance.description, instance.contactMail)));
    });
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
