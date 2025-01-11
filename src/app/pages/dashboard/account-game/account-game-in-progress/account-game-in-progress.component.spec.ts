import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountGameInProgressComponent } from './account-game-in-progress.component';

describe('AccountGameInProgressComponent', () => {
  let component: AccountGameInProgressComponent;
  let fixture: ComponentFixture<AccountGameInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountGameInProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountGameInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
