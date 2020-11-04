import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular'; 

@Component({
  selector: 'app-show-exercise',
  templateUrl: './show-exercise.component.html',
  styleUrls: ['./show-exercise.component.scss'],
})
export class ShowExerciseComponent implements OnInit {

	@Input() exercise: any; 

  constructor(public modal: ModalController) { }

  ngOnInit() {}
  close(){
  	this.modal.dismiss();
  }
}
