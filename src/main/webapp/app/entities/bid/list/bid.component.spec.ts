import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BidService } from '../service/bid.service';

import { BidComponent } from './bid.component';

describe('Bid Management Component', () => {
  let comp: BidComponent;
  let fixture: ComponentFixture<BidComponent>;
  let service: BidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BidComponent],
    })
      .overrideTemplate(BidComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BidComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BidService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.bids?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
