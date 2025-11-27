import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthUser } from './auth-user';

describe('AuthUser', () => {
  let component: AuthUser;
  let fixture: ComponentFixture<AuthUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthUser],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
