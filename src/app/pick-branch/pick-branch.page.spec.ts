import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PickBranchPage } from './pick-branch.page';

describe('PickBranchPage', () => {
  let component: PickBranchPage;
  let fixture: ComponentFixture<PickBranchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickBranchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PickBranchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
