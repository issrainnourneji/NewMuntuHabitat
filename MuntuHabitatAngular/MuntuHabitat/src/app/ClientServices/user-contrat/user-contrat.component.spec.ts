import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContratComponent } from './user-contrat.component';

describe('UserContratComponent', () => {
  let component: UserContratComponent;
  let fixture: ComponentFixture<UserContratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserContratComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserContratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
