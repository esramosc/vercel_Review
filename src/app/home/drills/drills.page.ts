import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service'; 
import { Storage } from '@ionic/storage'; 
import { DateService } from '../../services/date.service'; 
import { ModalController } from '@ionic/angular'; 
import { DrillModalComponent } from './drill-modal/drill-modal.component'; 

const DRILLS_ENDPOINT = (category_id:string|number, id_gimnasio:string|number, date:Date|string) => {
	return `gimnasio/${id_gimnasio}/wod`;
};

@Component({
  selector: 'app-drills',
  templateUrl: './drills.page.html',
  styleUrls: ['./drills.page.scss'],
})
export class DrillsPage implements OnInit {

	drills: any = []; 
	drillsPerDate: any = []; 

  category_id: number = 1;
  catalog = 'gym';
  showGymButton = false;
  showOdenButton = false;
  showLoader = true;
  isEmpty = false;

  constructor(
  	private api: ApiService,
  	private storage: Storage,
  	public dateService: DateService,
    public modalController: ModalController
	) {

  }


  async showDrill(drill) {
    let modal = await this.modalController.create({
      component: DrillModalComponent, 
      cssClass: 'responsive-modal',
      componentProps: {
        drill: drill
      }
    });
    modal.present(); 
  }


  async ngOnInit() {
    this.dateService.dateChange.subscribe(async () => {
      this.getDrills();
    });
    await this.setButtons();
    this.getDrills();
  }
  
  // ngOnDestroy() {}
  getDrills() {
    this.showLoader = true;
    this.isEmpty = false;
    this.drillsPerDate = [];
    if (this.category_id === 0) {
      return;
    }
    this.storage.get('user')
    .then(user => {
      if (this.catalog === 'oden') {
        return '1';
      } else {
        return user.gimnasio.id;
      }
    })
    .then(gymId => {
      return this.api.get("gimnasio/" + gymId + "/wod/filtro?page=1&nombre=" + "&fecha_inicio=" + this.dateService.formattedDate + "&fecha_fin=" + this.dateService.formattedDate, {});
    })
    .then(data => {
      var drillsResponse: any = data;
      var drills = drillsResponse.data;
      console.log('drills', drills);
      this.drillsPerDate = [];
      if (drills === undefined) {
        return;
      }
      drills.forEach((drill) => {
        if (this.drillsPerDate.find(d => drill.id == d.id) == undefined) {
          this.drillsPerDate.push(drill);
        }
      });
      this.showLoader = false;
      if (this.drillsPerDate.length === 0) {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    });
  }

  private isTimeToPublish(fecha_de_publicacion, publicar_ahora, drill_id) {
    if (publicar_ahora) {
      return true;
    } else {
      var now:any = new Date();
      var drill_date:any = new Date(fecha_de_publicacion.replace(/\s/g, "T"));
      if (now >= drill_date) {
        return true;
      } else {
        return false;
      }
    }
  }

  setCatalog(catalog) {
    this.catalog = catalog;
    const gymButton = document.querySelector('app-drills .store-picker .gym');
    const odenButton = document.querySelector('app-drills .store-picker .oden');

    if (catalog === 'gym') {
      gymButton.classList.add('picked');
      odenButton.classList.remove('picked');

    } else if (catalog === 'oden') {
      gymButton.classList.remove('picked');
      odenButton.classList.add('picked');
    }
    this.getDrills();
  }

  setButtons() {
    this.storage.get('current_branch').then(currentBranch => {
      console.log('currentBranch ESR: ', currentBranch.gimnasio.settings_gimnasio);
      currentBranch.gimnasio.settings_gimnasio.forEach(setting => {
        if (setting.name === 'wods_app') {
          if (setting.value === 'ambas') {
            this.showGymButton = true;
            this.showOdenButton = true;
          } else {
            if (setting.value === 'oden') {
              this.catalog = 'oden';
            }
          }
        }
      });
      this.getDrills();
    });
  }
}
