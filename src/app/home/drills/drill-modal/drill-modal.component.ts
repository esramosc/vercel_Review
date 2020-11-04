import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShowExerciseComponent } from './../../../components/show-exercise/show-exercise.component'; 
import Quill from 'quill'; 

const EmbedBlock = Quill.import('blots/block/embed');

class UIVideo extends EmbedBlock {

  static create(value) {
    // console.log('creating UI Video', value);
    let node = super.create();
    node.dataset.title = value.title;
    node.dataset.link = value.link;
    node.innerHTML = `
      <div class="oden-video">
        <div class="video-wrapper-text text">
          <div>${node.dataset.title}</div>
          <img src="/assets/images/youtube.svg"/>
        </div>
        <div class="video-wrapper">
          <iframe width="400" height="225" src="${node.dataset.link}" allowfullscreen="true"/>
        </div>
      </div>
    `;
    return node;
  }

  static value(domNode) {
    // console.log("value(domNode): ", domNode);
    return domNode.dataset;
  }
}
UIVideo.blotName = 'ui-video';
UIVideo.tagName = 'div';
UIVideo.className = 'ui-video';
Quill.register({
  'formats/ui-video': UIVideo
});
Quill.register(UIVideo);

class Video extends EmbedBlock {
  static create(value) {
    let node = super.create();
    node.innerHTML = `
      <div class="quill-custom-video">
        <div class="text video-wrapper-text">
          <div class="show-label">Ver video</div>
          <div class="hide-label">Esconder video</div>
          <img src="/assets/images/videocam-outline.svg"/>
        </div>
        <div class="video-wrapper">
          <iframe src="${value}" allowfullscreen="true"/>
        </div>
      </div>
    `;
    return node;
  }
  static formats(node) {
    return false;
  }
}

Video.tagName = 'div';
Video.blotName = 'video';

Quill.register({
  'formats/video': Video
});
Quill.register(Video);

@Component({
  selector: 'app-drill-modal',
  templateUrl: './drill-modal.component.html',
  styleUrls: ['./drill-modal.component.scss'],
})
export class DrillModalComponent implements OnInit {

	@Input() drill: any; 

  clickListener = (e: any)=>{
    if (e.target.classList.contains('video-wrapper-text')) {
      this.toggleVideo(e);
    }
  };
  constructor(public modal: ModalController, private modal2: ModalController) { }

  close() {
  	this.modal.dismiss(); 
  }
  ngOnInit() {
    document.addEventListener('click', this.clickListener, true);
  }
  ngOnDestroy(){
    document.removeEventListener('click', this.clickListener, true);
  }

  toggleVideo(event) {
    let wrapper = <HTMLElement>event.target.parentElement;
    if (!wrapper.classList.contains('shown')) {
      wrapper.classList.add('shown');
    } else {
      wrapper.classList.remove('shown');
    }
  }
  public async showExercise(exercise) {
    let modal = await this.modal2.create({
      component: ShowExerciseComponent, 
      cssClass: 'responsive-modal',
      componentProps: {
        exercise: exercise
      }
    }); 
    modal.present(); 
  }

  ngAfterViewInit()  {
    this.drill.rondas.forEach((r)=>{
      this.initializeEditor(r);       
    });
  }

  public initializeEditor(round){
    let container = document.querySelector("#editor-" + round.id);

    var options = {
      theme: 'snow',
      readOnly: true,
      modules: {
        toolbar: false
      }      
    }
    round.editor = new Quill(container, options);

    this.setEditorContent(round); 

    // round.editor.setContents(JSON.parse(this.wod.content)); 
  }
  setEditorContent(r) {
    if (r.content != "") {

      setTimeout(()=>{

        let content = JSON.parse(r.content); 

        if (content) {
          r.editor.setContents(content); 
        }
      }, 100);
    }
  } 
}
