import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.page.html',
  styleUrls: ['./restaurant-info.page.scss'],
})
export class RestaurantInfoPage implements OnInit {

  id: string;
  info = null;
  loaded = false;

  constructor(private activatedRoute: ActivatedRoute, private navCtrl: NavController, private restaurantService: RestaurantService,
              private loadingController: LoadingController, private alertController: AlertController) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getRestaurant();
  }

  async getRestaurant() {

    const loading = await this.loadingController.create({
      message: 'Loading restaurant'
    });
    await loading.present();

    this.restaurantService.getInfo(this.id).subscribe((ans) => {
      this.info = ans;
      this.loadingController.dismiss();
      this.loaded = true;
    },

    (err) => {
      this.loadingController.dismiss();
      this.presentServerError();
    });
  }

  back() {
    this.navCtrl.pop();
  }

  /**
   * Presents error about problem with a server
   */
  async presentServerError() {
    const alert = await this.alertController.create({
      header: 'Can not get restaurant',
      message: 'There was an error connecting to the server.',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
          handler:() => {
            this.navCtrl.pop();
          }
        }
      ]
    });

    await alert.present();
  }

}
