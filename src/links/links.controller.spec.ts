import { Test, TestingModule } from '@nestjs/testing';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { Response } from 'express';
import { RequestWithLink } from './interfaces/express-request.interface';

describe('LinksController', () => {
  let controller: LinksController;
  let service: LinksService;

  const mockLinksService = {
    incrementRedirectCount: jest.fn(),
    create: jest.fn(), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinksController],
      providers: [
        {
          provide: LinksService,
          useValue: mockLinksService,
        },
      ],
    }).compile();

    controller = module.get<LinksController>(LinksController);
    service = module.get<LinksService>(LinksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to the originalUrl and increment the counter', async () => {
    const link = {
      _id: '507f1f77bcf86cd799439011',
      originalUrl: 'https://google.com',
    };

    const req = {
      link,
    } as RequestWithLink;

    const res = {
      redirect: jest.fn(),
    } as unknown as Response;

    await controller.redirect(link._id, '1234', res, req);

    expect(service.incrementRedirectCount).toHaveBeenCalledWith(link._id);
    expect(res.redirect).toHaveBeenCalledWith(link.originalUrl);
  });

  it('should create a link and return the data', async () => {
    const dto = {
        url: 'https://youtube.com',
        password: '1234',
        expiresAt: '2025-12-31T23:59:59Z',
    };

    const mockResponse = {
        target: dto.url,
        link: 'http://localhost:3000/l/xyz12',
        valid: true,
    };

    mockLinksService.create = jest.fn().mockResolvedValue(mockResponse);

    const result = await controller.create(dto);

    expect(mockLinksService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResponse);
    });
});
