import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPlayerItemComponent } from './group-player-item.component';

describe('GroupPlayerItemComponent', () => {
  let component: GroupPlayerItemComponent;
  let fixture: ComponentFixture<GroupPlayerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupPlayerItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupPlayerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
