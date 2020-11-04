import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
// import { OdenRankingUser } from "./oden-ranking-user/oden-ranking-user";
// import { IFilterData } from "../../../../components/ranking-filter-modal/interfaces";
// import { mockedRankingUsers } from "./constants";
// import { RankingComponent } from "../../../../components/ranking/ranking";
// import { RankingFilterModalComponent } from "../../../../components/ranking-filter-modal/ranking-filter-modal";
// import { Api } from '../../../../providers/api';
import { Storage } from '@ionic/storage';
import { ApiService as Api } from '../../services/api.service';
import { DateService } from '../../services/date.service';
import { ShowExerciseComponent } from '../../components/show-exercise/show-exercise.component'; 
import { DrillModalComponent } from '../drills/drill-modal/drill-modal.component'; 

declare var Confetti: any; 
declare var ClearConfetti: any; 
declare var canvas: any; 
declare var confetti: any; 

export interface IRankingUser {
  imgURL: string;
  id: number;
  position: number;
  name: string;
  points: number;
}

export interface RankingResponse {
  current_page: number;
  pages: number;
  data: IRankingUser[];
} 

export interface IFilterData {
  startDate: Date;
  endDate: Date;
  drillType: string;
  intent: 'data' | 'dismiss';
}

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {

  wod_id: number;
  ronda_id: number;
  displayedRanking: IRankingUser[] = [];
  filteredRanking: IRankingUser[] = [];
  allRanking: IRankingUser[] = [];
  pages: number[];
  currentPage: number;
  ranking: any;
  date: any = new Date(); 
  user: any; 
  current_date: any;
  wods: any;
  rondas: any;
  rx:boolean = true;
  query: string = "";
  gender: string = "A";
  catalog: string = "gym";
  confetti: any;
  initialLoading = true;
  currentPosition = 0;
  constructor(
  	private modalCtrl: ModalController, 
  	public apiCtrl: Api, 
  	public storage: Storage,
    public dateService: DateService
	) {
  }

  async ngOnInit() {
    // await this.getPage(1);
    this.storage.get("user").then(user=>{
      this.user = user;
    }).then(()=>{
      this.dateService.dateChange.subscribe(()=>{
        this.current_date = this.dateService.date; 
        this.getCategories(); 
      });
      this.current_date = this.dateService.date; 
      this.getCategories(); 
    });    
  }

  getPreviousDate() {
    const tomorrow = new Date(this.current_date);

    this.current_date = tomorrow.setDate(tomorrow.getDate() + 1);
    this.getCategories();

  }

  getNextDate() {
    const yesterday = new Date(this.current_date);
    this.current_date = yesterday.setDate(yesterday.getDate() - 1);
    this.getCategories();


  }

  
  getFormatedBackgroundImage(imgURL: string): string {
    return `url(${imgURL})`;
  }

  private setPagination(numberOfPage: number, currentPage: number): void {
    this.pages = Array.from(Array(numberOfPage).keys());
    this.currentPage = currentPage;
  }
  async showSelectedWOD() {
    let wod = this.wods.find((w)=>{return w.id == this.wod_id});
    let modal = await this.modalCtrl.create({
      component: DrillModalComponent, 
      cssClass: 'responsive-modal',
      componentProps: {
        drill: wod
      }
    });
    modal.present(); 
  }
  showDetail(ranking) {
    // var modal = this.modalCtrl.create(OdenRankingUser, {
    //   ronda_id: this.ronda_id,
    //   name: ranking.nombre,
    //   position: ranking.position,
    //   id_usuario: ranking.id_usuario
    // }, {
    //   showBackdrop: true,
    // })
    // modal.present(); 
    // modal.onDidDismiss(()=>{
    // }); 
  }
  
  //
  setGender(gender) {
    this.gender = gender; 
    const all_button = document.querySelector('app-ranking .picker .all');
    const male_button = document.querySelector('app-ranking .picker .male');
    const female_button = document.querySelector('app-ranking .picker .female');

    if (gender == 'A') {
      all_button.classList.add('picked');
      male_button.classList.remove('picked');
      female_button.classList.remove('picked');

    } else if (gender == 'H') {
      male_button.classList.add('picked');
      all_button.classList.remove('picked');
      female_button.classList.remove('picked');
    } else if (gender == 'M') {
      female_button.classList.add('picked');
      all_button.classList.remove('picked');
      male_button.classList.remove('picked');
    }
    this.getRanking();
  }

  setCatalog(catalog) {
    this.catalog = catalog; 
    const gym_button = document.querySelector('app-ranking .store-picker .gym');
    const oden_button = document.querySelector('app-ranking .store-picker .oden');

    if (catalog == 'gym') {
      gym_button.classList.add('picked');
      oden_button.classList.remove('picked');

    } else if (catalog == 'oden') {
      gym_button.classList.remove('picked');
      oden_button.classList.add('picked');
    } 
    this.getWods();
  }
  // private async getPage(pageNumber: number): Promise<void> {
  //   const response = await this.getListByPage(pageNumber);
  //   this.allRanking = response.data;
  //   this.setDisplayedRanking(response.data);
  //   this.setPagination(response.pages, response.current_page);
  // }

  // private getListByPage(pageNumber: number): Promise<RankingResponse> {
  //   return new Promise(async (res) => {
  //     res({
  //       data: await this.getRanklist(),
  //       current_page: 1,
  //       pages: 4
  //     })
  //   })
  // }

  goToUserRankingDetail(user: IRankingUser): void {
    // const rankingDetailModal = this.modalCtrl.create(OdenRankingUser, { userId: user.id });
    // rankingDetailModal.present();
  }

  displayFilterModal() {
    // const rankingFilterModal = this.modalCtrl.create(RankingFilterModalComponent);
    // rankingFilterModal.onDidDismiss((dismissData: IFilterData) => this.handleOnModalDissmiss(dismissData));
    // rankingFilterModal.present();
  }

  handleSearchbarQuery() {
    var url:string = "ejecucion/ranking?id_ronda=" + this.ronda_id + "&rx=" + this.rx + "&nombre=" + this.query; 
    this.apiCtrl.get(url, {}).then(data => { 
      var resp: any = data;
      this.ranking = resp.data;
      
    });
    // this.setDisplayedRanking(this.filterRanking(query));
  }

  private handleOnModalDissmiss(dismissData: IFilterData) {
    if (dismissData.intent === 'data') {
      this.setDisplayedRanking(this.filterRanking());
    }
  }

  private filterRanking(queryName?: string, start?: Date, end?: Date, drillType?: string): IRankingUser[] {
    let result: IRankingUser[] = [];
    if (queryName) {
      result = this.allRanking.filter(u => u.name.toLowerCase().includes(queryName.toLowerCase()));
    }
    return result;
  }

  private setDisplayedRanking(ranking: IRankingUser[]): void {
    this.resetRanking();
    this.displayedRanking = ranking;
  }

  private resetRanking(): void {
    this.filteredRanking = [];
    this.displayedRanking = this.allRanking;
  }

  private getCategories() {
    this.getWods();
    
  }
  changeRx() {
    this.getRanking();
  }
  getRanking() {
    
    var url:string = "ejecucion/ranking?id_ronda=" + this.ronda_id + "&rx=" + this.rx + "&gender=" + this.gender + "&gym=" + this.catalog; 
    this.apiCtrl.get(url, {}).then(data => { 
      var resp: any = data;
      this.ranking = resp.data;
      var shouldFireConfetti = false; 
      this.ranking.forEach((r)=>{
        if (r.id_usuario == this.user.id && r.position < 6) {
          shouldFireConfetti = true; 
        };
      });
      if (shouldFireConfetti) {
        this.confetti = new Confetti();
        setTimeout(()=>{
          if (this.confetti != undefined) {
            confetti.stop(); 
            canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height); 
          }
        }, 11000);
      } else {
        if (this.confetti != undefined) {
          confetti.stop(); 
          canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height); 
        }
      }
      if (this.initialLoading && this.ranking.length === 0) {
        this.currentPosition++;
        if (this.rondas[this.currentPosition]) {
          this.ronda_id = this.rondas[this.currentPosition].id.toString();
          this.getRanking();
        } else {
          this.initialLoading = false;
        }
      }
    });
  }

  changeWod() {
    this.wods.filter((wod) => {
      if (wod.id == this.wod_id) {
        this.rondas = wod.rondas;
        if (this.rondas.length > 0) {
          this.ronda_id = this.rondas[0].id.toString();
          this.getRanking();
        }
        return wod.rondas;
      }
    });

  }

  changeRonda() {
    this.getRanking();
  }
  getWods() {
    var date = new Date(this.current_date.getTime() - (this.current_date.getTimezoneOffset() * 60000)).toISOString();
    var gym: string = "0";
    if (this.catalog == "oden") {
      gym = "1";
    } else {
      gym = this.user.gimnasio.id;
    }
    this.apiCtrl.get("gimnasio/" + gym + "/wod/filtro?page=1" + "&nombre=&id_tipo_wod=-1&fecha_inicio=" + date+ "&fecha_fin=" + date, {}).then(data => { 
      var resp: any = data;
      this.wods = resp.data;
      this.rondas = [];
      this.ranking = [];
      if (this.wods.length > 0) {
        this.wod_id = this.wods[0].id.toString();
        this.changeWod();
      }
    }); 
  }

  formatResult(resultado) {
    const resultSplit = resultado.toString().split(':');
    if (resultSplit.length === 3) {
      return resultSplit[1] + ':' + resultSplit[2];
    } else {
      return resultado;
    }
  }



}
