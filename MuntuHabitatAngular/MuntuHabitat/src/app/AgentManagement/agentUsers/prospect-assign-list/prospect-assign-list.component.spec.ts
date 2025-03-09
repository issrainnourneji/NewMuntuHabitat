import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectAssignListComponent } from './prospect-assign-list.component';

describe('ProspectAssignListComponent', () => {
  let component: ProspectAssignListComponent;
  let fixture: ComponentFixture<ProspectAssignListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProspectAssignListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProspectAssignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
