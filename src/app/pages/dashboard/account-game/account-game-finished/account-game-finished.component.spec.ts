import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountGameFinishedComponent } from './account-game-finished.component';

describe('AccountGameFinishedComponent', () => {
  let component: AccountGameFinishedComponent;
  let fixture: ComponentFixture<AccountGameFinishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountGameFinishedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountGameFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
