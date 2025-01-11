import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountGamePlatinumComponent } from './account-game-platinum.component';

describe('AccountGamePlatinumComponent', () => {
  let component: AccountGamePlatinumComponent;
  let fixture: ComponentFixture<AccountGamePlatinumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountGamePlatinumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountGamePlatinumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
