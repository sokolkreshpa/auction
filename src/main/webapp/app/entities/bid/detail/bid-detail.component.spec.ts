import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BidDetailComponent } from './bid-detail.component';

describe('Bid Management Detail Component', () => {
  let comp: BidDetailComponent;
  let fixture: ComponentFixture<BidDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BidDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bid: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BidDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BidDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bid on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bid).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
