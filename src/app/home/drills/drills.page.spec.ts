import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrillsPage } from './drills.page';

describe('DrillsPage', () => {
  let component: DrillsPage;
  let fixture: ComponentFixture<DrillsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DrillsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
