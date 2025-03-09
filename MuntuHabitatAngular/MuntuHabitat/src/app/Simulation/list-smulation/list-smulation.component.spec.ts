import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSmulationComponent } from './list-smulation.component';

describe('ListSmulationComponent', () => {
  let component: ListSmulationComponent;
  let fixture: ComponentFixture<ListSmulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSmulationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSmulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
