import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBid, Bid } from '../bid.model';

import { BidService } from './bid.service';

describe('Bid Service', () => {
  let service: BidService;
  let httpMock: HttpTestingController;
  let elemDefault: IBid;
  let expectedResult: IBid | IBid[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BidService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      bidTime: currentDate,
      amount: 0,
      ccy: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          bidTime: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Bid', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          bidTime: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          bidTime: currentDate,
        },
        returnedFromService
      );

      service.create(new Bid()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bid', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          bidTime: currentDate.format(DATE_TIME_FORMAT),
          amount: 1,
          ccy: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          bidTime: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Bid', () => {
      const patchObject = Object.assign({}, new Bid());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          bidTime: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Bid', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          bidTime: currentDate.format(DATE_TIME_FORMAT),
          amount: 1,
          ccy: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          bidTime: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Bid', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBidToCollectionIfMissing', () => {
      it('should add a Bid to an empty array', () => {
        const bid: IBid = { id: 123 };
        expectedResult = service.addBidToCollectionIfMissing([], bid);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bid);
      });

      it('should not add a Bid to an array that contains it', () => {
        const bid: IBid = { id: 123 };
        const bidCollection: IBid[] = [
          {
            ...bid,
          },
          { id: 456 },
        ];
        expectedResult = service.addBidToCollectionIfMissing(bidCollection, bid);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bid to an array that doesn't contain it", () => {
        const bid: IBid = { id: 123 };
        const bidCollection: IBid[] = [{ id: 456 }];
        expectedResult = service.addBidToCollectionIfMissing(bidCollection, bid);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bid);
      });

      it('should add only unique Bid to an array', () => {
        const bidArray: IBid[] = [{ id: 123 }, { id: 456 }, { id: 99256 }];
        const bidCollection: IBid[] = [{ id: 123 }];
        expectedResult = service.addBidToCollectionIfMissing(bidCollection, ...bidArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bid: IBid = { id: 123 };
        const bid2: IBid = { id: 456 };
        expectedResult = service.addBidToCollectionIfMissing([], bid, bid2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bid);
        expect(expectedResult).toContain(bid2);
      });

      it('should accept null and undefined values', () => {
        const bid: IBid = { id: 123 };
        expectedResult = service.addBidToCollectionIfMissing([], null, bid, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bid);
      });

      it('should return initial array if no Bid is added', () => {
        const bidCollection: IBid[] = [{ id: 123 }];
        expectedResult = service.addBidToCollectionIfMissing(bidCollection, undefined, null);
        expect(expectedResult).toEqual(bidCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
