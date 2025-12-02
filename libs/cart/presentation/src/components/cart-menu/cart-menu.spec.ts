import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartMenu } from './cart-menu';

describe('CartMenu', () => {
  let component: CartMenu;
  let fixture: ComponentFixture<CartMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(CartMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
