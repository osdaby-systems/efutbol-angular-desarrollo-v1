import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGoleadoresComponent } from './tabla-goleadores.component';

describe('TablaGoleadoresComponent', () => {
  let component: TablaGoleadoresComponent;
  let fixture: ComponentFixture<TablaGoleadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaGoleadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaGoleadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
