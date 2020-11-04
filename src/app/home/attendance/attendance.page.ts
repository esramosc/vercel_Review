import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage';
import { DateService } from '../../services/date.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { UserSearchComponent } from '../../components/user-search/user-search.component';
import { interval } from 'rxjs';

const BRANCHES = 'gimnasio/';
const CLASSES_BY_BRANCH_AND_DATE = 'clase/por-sucursal-fecha';
const NEW_ASSISTANCE = 'asistencia/store-admin';
const ATTENDANTS_BY_SESSION = 'asistencia/por-sesion';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  clases: any;
  attendantsList: any;
  actualSessionId = 0;
  schedule: string;
  sessionOptions: any;
  selectedClass = 0;
  selectedSession = 0;
  clase = '';

  constructor(
    private api: ApiService,
    private storage: Storage,
    private dateService: DateService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.storage.get('token').then(token => {
      this.getClasses().then(clases => {
        this.clases = clases;
        this.getAttendantList();
        interval(100000).subscribe(x => {
          this.getAttendantList();
        });
      });
      this.dateService.dateChange.subscribe(() => {
        this.getClasses().then(clases => {
          this.clases = clases;
          this.getAttendantList();
        });
      });
      this.getClasses();
    });
  }

  public getClasses(): Promise<any> {
    this.clases = [];
    return this.storage.get('current_branch')
      .then(branch => {
        return this.api.get(`${CLASSES_BY_BRANCH_AND_DATE}?fecha=${this.dateService.formattedDate}&id_sucursal=${branch.id}`, {});
      })
      .then(response => {
        return response.data;
      });
  }

  public async openSelectSessionModal(c) {
    var the_input: any = {
      type: 'radio',
      label: 'label',
      value: '0'
    }
    var the_inputs: any = [];
    for (var i = 0; i < c.sesiones.length; i++) {
      the_input = {
        type: 'radio',
        label: this.getTime(c.sesiones[i].fecha_inicio) + this.getProfessorsString(c.sesiones[i], c.sucursal),
        value: c.sesiones[i]
      };
      the_inputs.push(the_input);
    }
    let alert = await this.alertCtrl.create({
      message: 'Escoge el horario',
      inputs: the_inputs,
      cssClass: 'my-custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Registrarme',
          handler: async (sesion) => {
            console.log('sesion seleccionada esr: ', sesion);
            // Verificar si se le permite registrar en base a la configuración de la sucursal
            this.storage.get('current_branch').then(async branch => {
              const daySetting = parseInt(branch.dias_reservacion);
              let checkClasss = this.checkIfRegisterIsAvailable(daySetting, sesion.fecha_inicio);
              if (checkClasss.isAvailable) {
                let modal = await this.modalCtrl.create({
                  component: UserSearchComponent,
                });
                modal.present();
                const { data } = await modal.onWillDismiss();
                if (data !== undefined && data.users !== undefined) {
                  data.users.forEach(u => {
                    let d: any = {
                      id_usuario: u.id,
                      id_sesion: sesion.id,
                      asistio: true,
                      notas: ''
                    };
                    this.api.post(NEW_ASSISTANCE, d)
                      .then(async response => {
                        this.callAttendantList(sesion.id);
                        if (response.errors) {
                          return Promise.reject(response.errors);
                        }
                        var toast = await this.toastCtrl.create({
                          message: '¡Registro exitoso!',
                          position: 'bottom',
                          duration: 3000,
                          color: 'success',
                          buttons: [
                            {
                              icon: 'checkmark-circle-outline',
                              handler: () => {
                                toast.dismiss();
                              }
                            }
                          ]
                        });
                        toast.present();
                      }).catch(errors => {
                        errors.forEach(async (e) => {
                          var toast = await this.toastCtrl.create({
                            message: e,
                            position: 'bottom',
                            duration: 3000,
                            color: 'warning',
                            buttons: [
                              {
                                icon: 'warning-outline',
                                handler: () => {
                                  toast.dismiss();
                                }
                              }
                            ]
                          });
                          toast.present();
                        });
                      });
                  });
                }
              } else {
                // Mostrar mensaje de porque no se puede registrar
                console.log(checkClasss.message);
                this.presentAlert(checkClasss.message);
              }
            });
            // this.registerForClass(JSON.stringify(data));
            // I NEED TO GET THE VALUE OF THE SELECTED RADIO BUTTON HERE
          }
        }
      ]
    });
    alert.present();
  }

  private getTime(date) {
    var d = new Date(date.replace(/-/gi, '/'));
    var min = String(d.getMinutes());
    var hour = String(d.getHours());
    if (min.length < 2) {
      min = '0' + min;
    }
    if (hour.length < 2) {
      hour = '0' + hour;
    }
    return hour + ':' + min;
  }

  private getProfessorsString(sesion, sucursal) {
    let profe = '';
    if (sesion.profesor !== null) {
      profe = ' (' + sesion.profesor.nombre + ' ' + sesion.profesor.apellido_paterno + ' ' + sesion.profesor.apellido_materno + ')';
    } else {
      profe = ' (' + sucursal.nombre + ')';
    }
    return profe;
  }

  private getAttendantList() {
    const d = new Date();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const milliseconds = this.getMilliseconds(hours, minutes);
    const tenMinutes = 600000;
    this.clases.forEach(clase => {
      clase.sesiones.forEach(sesion => {
        const sesionInitDate = new Date(sesion.fecha_inicio);
        const hoursInitDate = sesionInitDate.getHours();
        const minutesInitDate = sesionInitDate.getMinutes();
        const millisecondsInitDate = this.getMilliseconds(hoursInitDate, minutesInitDate);
        const sesionEndDate = new Date(sesion.fecha_fin);
        const hoursEndDate = sesionEndDate.getHours();
        const minutesEndDate = sesionEndDate.getMinutes();
        const millisecondsEndDate = this.getMilliseconds(hoursEndDate, minutesEndDate);
        if (milliseconds >= (millisecondsInitDate - tenMinutes) &&
        milliseconds <= millisecondsEndDate) {
          if (this.actualSessionId !== sesion.id) {
            this.actualSessionId = sesion.id;
            this.schedule = sesion.fecha_inicio;
            this.callAttendantList(sesion.id);
            this.clase = clase.nombre;
          }
        }
      });
    });
  }

  private callAttendantList(sessionId) {
    this.api.get(`${ATTENDANTS_BY_SESSION}?id_sesion=${sessionId}`, {})
      .then(result => {
        this.attendantsList = result.data;
      });
  }

  private getMilliseconds(hours, minutes) {
    return ((hours * 60 * 60 + minutes * 60) * 1000);
  }

  public getMembershipStatus(attendant) {
    let status = '';
    if (attendant.usuario_membresia !== null) {
      if (attendant.usuario_membresia.length === 0) {
        status = 'vencido2';
      } else {
        if (this.proximoAVencer(attendant.usuario_membresia.fecha_corte)) {
          status = 'next-to-expire2';
        }
      }
    } else {
      status = 'vencido2';
    }
    return status;
  }

  private proximoAVencer(fechaCorte: string) {
    const hoy = new Date();
    let vencimiento: Date;
    let result = false;
    vencimiento = new Date(fechaCorte);
    vencimiento.setDate(vencimiento.getDate() - 5);
    if (hoy >= vencimiento) {
      result = true;
    }
    return result;
  }

  public getSessions() {
    if (this.selectedClass == 0) {
      this.sessionOptions = [];
    } else {
      this.clases.forEach(element => {
        if (parseInt(element.id) == this.selectedClass) {
          this.sessionOptions = element.sesiones;
        }
      });
    }
  }

  public getAttendants() {
    if (this.selectedSession != 0) {
      this.callAttendantList(this.selectedSession);
      this.setSchedule();
    }
  }

  private setSchedule() {
    this.clases.forEach(clase => {
      if (clase.id == this.selectedClass) {
        clase.sesiones.forEach(sesion => {
          if (sesion.id == this.selectedSession) {
            this.schedule = sesion.fecha_inicio;
            this.clase = clase.nombre;
          }
        });
      }
    });
  }

  private checkIfRegisterIsAvailable(daySetting, initDate) {
    let result = {
      isAvailable: true,
      message: '',
    }
    if (daySetting !== 0) {
      let minDate = new Date(Date.parse(initDate));
      const today = new Date();
      minDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (minDate.getTime() === today.getTime()) {
        result.isAvailable = false;
        result.message = 'Solo se permite inscribir con ' + daySetting + ' días de anticipación';
      } else {
        if (minDate.getTime() < today.getTime()) {
          result.isAvailable = false;
          result.message = 'No se pueden realizar inscripciones a sesiones antiguas';
        } else {
          minDate.setDate(minDate.getDate() - daySetting);
          if (today.getTime() < minDate.getTime()) {
            result.isAvailable = false;
            result.message = 'Solo se permite inscribir con ' + daySetting + ' días de anticipación';
          }
        }
      }
    }
    console.log('result: ', result);
    return result;
  }

  async presentAlert(message) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Algo salió mal',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
