import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BidService } from '../service/bid.service';
import { IBid, Bid } from '../bid.model';
import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';
import { IAuction } from 'app/entities/auction/auction.model';
import { AuctionService } from 'app/entities/auction/service/auction.service';

import { BidUpdateComponent } from './bid-update.component';

describe('Bid Management Update Component', () => {
  let comp: BidUpdateComponent;
  let fixture: ComponentFixture<BidUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bidService: BidService;
  let usersService: UsersService;
  let auctionService: AuctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BidUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BidUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BidUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bidService = TestBed.inject(BidService);
    usersService = TestBed.inject(UsersService);
    auctionService = TestBed.inject(AuctionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call userId query and add missing value', () => {
      const bid: IBid = { id: 456 };
      const userId: IUsers = { id: 11070 };
      bid.userId = userId;

      const userIdCollection: IUsers[] = [{ id: 81557 }];
      jest.spyOn(usersService, 'query').mockReturnValue(of(new HttpResponse({ body: userIdCollection })));
      const expectedCollection: IUsers[] = [userId, ...userIdCollection];
      jest.spyOn(usersService, 'addUsersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bid });
      comp.ngOnInit();

      expect(usersService.query).toHaveBeenCalled();
      expect(usersService.addUsersToCollectionIfMissing).toHaveBeenCalledWith(userIdCollection, userId);
      expect(comp.userIdsCollection).toEqual(expectedCollection);
    });

    it('Should call Auction query and add missing value', () => {
      const bid: IBid = { id: 456 };
      const auctionId: IAuction = { id: 96166 };
      bid.auctionId = auctionId;

      const auctionCollection: IAuction[] = [{ id: 47805 }];
      jest.spyOn(auctionService, 'query').mockReturnValue(of(new HttpResponse({ body: auctionCollection })));
      const additionalAuctions = [auctionId];
      const expectedCollection: IAuction[] = [...additionalAuctions, ...auctionCollection];
      jest.spyOn(auctionService, 'addAuctionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bid });
      comp.ngOnInit();

      expect(auctionService.query).toHaveBeenCalled();
      expect(auctionService.addAuctionToCollectionIfMissing).toHaveBeenCalledWith(auctionCollection, ...additionalAuctions);
      expect(comp.auctionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bid: IBid = { id: 456 };
      const userId: IUsers = { id: 13669 };
      bid.userId = userId;
      const auctionId: IAuction = { id: 61661 };
      bid.auctionId = auctionId;

      activatedRoute.data = of({ bid });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(bid));
      expect(comp.userIdsCollection).toContain(userId);
      expect(comp.auctionsSharedCollection).toContain(auctionId);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bid>>();
      const bid = { id: 123 };
      jest.spyOn(bidService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bid });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bid }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(bidService.update).toHaveBeenCalledWith(bid);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bid>>();
      const bid = new Bid();
      jest.spyOn(bidService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bid });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bid }));
      saveSubject.complete();

      // THEN
      expect(bidService.create).toHaveBeenCalledWith(bid);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bid>>();
      const bid = { id: 123 };
      jest.spyOn(bidService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bid });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bidService.update).toHaveBeenCalledWith(bid);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUsersById', () => {
      it('Should return tracked Users primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUsersById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAuctionById', () => {
      it('Should return tracked Auction primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAuctionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
