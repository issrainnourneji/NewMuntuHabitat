import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFacturesComponent } from './all-factures.component';

describe('AllFacturesComponent', () => {
  let component: AllFacturesComponent;
  let fixture: ComponentFixture<AllFacturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllFacturesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllFacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
