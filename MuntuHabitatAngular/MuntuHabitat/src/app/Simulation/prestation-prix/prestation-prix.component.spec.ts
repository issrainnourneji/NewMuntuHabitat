import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationPrixComponent } from './prestation-prix.component';

describe('PrestationPrixComponent', () => {
  let component: PrestationPrixComponent;
  let fixture: ComponentFixture<PrestationPrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrestationPrixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrestationPrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
