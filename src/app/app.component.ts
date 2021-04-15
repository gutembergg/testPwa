import { Component } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";

import { ModalController, ToastController } from "@ionic/angular";
import { environment } from "src/environments/environment.prod";
import { ModalComponent } from "./modal/modal.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "testpwa";

  constructor(
    public _toastCtr: ToastController,
    public modalController: ModalController,
    private _updates: SwUpdate
  ) {
    this.checkDevice();
    this.checkUpdates();
  }

  checkDevice() {
    const isIos = () => {
      const infoDevice = window.navigator.userAgent.toLocaleLowerCase();
      console.log("infoDevice", infoDevice);
      return /iphone|ipad|ipod/.test(infoDevice);
    };

    const isInStandaloneMode = () =>
      "standalone" in (window as any).navigator &&
      (window as any).navigator.standalone;

    if (isIos() && !isInStandaloneMode()) {
      this.presentModal();
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalComponent
    });
    return await modal.present();
  }

  checkUpdates() {
    this._updates.available.subscribe((res) => {
      console.log("--->", res);
      if (res) {
        this.displayPopUpUpdate();
      }
    });
  }

  async showToast() {
    const toast = await this._toastCtr.create({
      header: "Toast header",
      message: "Click to Close",
      position: "top",
      buttons: [
        {
          side: "start",
          icon: "star",
          text: "Favorite",
          handler: () => {
            this.activateUpdate();
          }
        },
        {
          text: "Done",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    await toast.present();
  }

  async displayPopUpUpdate() {
    const toast = await this._toastCtr.create({
      message: `Update available`,
      position: "bottom",
      keyboardClose: true,
      color: "dark",
      buttons: [
        {
          text: "ok",
          role: "canc",
          handler: async () => {
            await this._updates.activateUpdate();
            window.location.reload();
          }
        }
      ]
    });
    await toast.present();
  }

  activateUpdate() {
    if (environment.production) {
      this._updates.activateUpdate().then(() => {
        window.location.reload();
      });
    }
  }
}
