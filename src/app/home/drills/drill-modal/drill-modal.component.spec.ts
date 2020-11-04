import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrillModalComponent } from './drill-modal.component';

describe('DrillModalComponent', () => {
  let component: DrillModalComponent;
  let fixture: ComponentFixture<DrillModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DrillModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
