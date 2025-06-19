import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPlayersComponent } from './find-players.component';

describe('FindPlayersComponent', () => {
  let component: FindPlayersComponent;
  let fixture: ComponentFixture<FindPlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindPlayersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
