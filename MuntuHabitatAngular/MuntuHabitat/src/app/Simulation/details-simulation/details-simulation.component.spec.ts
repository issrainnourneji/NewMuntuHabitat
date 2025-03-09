import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSimulationComponent } from './details-simulation.component';

describe('DetailsSimulationComponent', () => {
  let component: DetailsSimulationComponent;
  let fixture: ComponentFixture<DetailsSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsSimulationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
