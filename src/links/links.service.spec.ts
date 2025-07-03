import { Test, TestingModule } from '@nestjs/testing';
import { LinksService } from './links.service';
import { getModelToken } from '@nestjs/mongoose';
import { Link } from './entities/link.entity';
import { NotFoundException } from '@nestjs/common';

describe('LinksService', () => {
  let service: LinksService;
  let mockLinkModel: any;

  beforeEach(async () => {

    mockLinkModel = jest.fn().mockImplementation((data) => ({
      ...data,
      valid: true,
      save: jest.fn().mockResolvedValue(undefined),
    }));

    mockLinkModel.findOne = jest.fn();
    mockLinkModel.findByIdAndUpdate = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: getModelToken(Link.name),
          useValue: mockLinkModel,
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
  });


  it('should create a link without a password or expiration date', async () => {
    const dto = {
      url: 'https://google.com',
    };

    const result = await service.create(dto);

    expect(result).toHaveProperty('link');
    expect(result).toHaveProperty('target', dto.url);
    expect(result).toHaveProperty('valid', true);
  });

  it('should create a link with password and expiration date', async () => {
    const dto = {
      url: 'https://youtube.com',
      password: '1234',
      expiresAt: '2025-12-31T23:59:59Z',
    };

    const result = await service.create(dto);

    expect(result.link).toMatch(/http:\/\/localhost:3000\/l\//);
    expect(result.target).toBe(dto.url);
    expect(result.valid).toBe(true);
  });

  it('should invalidate an existing link', async () => {
    const mockSave = jest.fn().mockResolvedValue(undefined);

    const fakeLink = {
      shortId: 'abc123',
      valid: true,
      save: mockSave,
    };

    mockLinkModel.findOne.mockResolvedValueOnce(fakeLink);

    const result = await service.invalidate('abc123');

    expect(result).toEqual({
      message: 'Link invalidated correctly',
      shortId: 'abc123',
    });

    expect(fakeLink.valid).toBe(false);
    expect(mockSave).toHaveBeenCalled();
  });

  
  it('should throw error if the link does not exist', async () => {
    mockLinkModel.findOne.mockResolvedValueOnce(null);

    await expect(service.invalidate('doesNotExist')).rejects.toThrow(NotFoundException);
  });

  it('should return statistics if the link exists', async () => {
    const fakeLink = {
      shortId: 'abc123',
      originalUrl: 'https://ejemplo.com',
      redirectCount: 5,
      createdAt: new Date('2024-01-01'),
      expiresAt: new Date('2025-01-01'),
      valid: true,
    };

    mockLinkModel.findOne.mockResolvedValueOnce(fakeLink);

    const result = await service.getStats('abc123');

    expect(result).toEqual({
      shortId: 'abc123',
      originalUrl: 'https://ejemplo.com',
      redirectCount: 5,
      createdAt: fakeLink.createdAt,
      expiresAt: fakeLink.expiresAt,
      valid: true,
    });
  });

  it('should throw NotFoundException if the link does not exist', async () => {
    mockLinkModel.findOne.mockResolvedValueOnce(null);

    await expect(service.getStats('doesNotExist')).rejects.toThrow(NotFoundException);
  });

  it('should increase the redirection counter', async () => {
    mockLinkModel.findByIdAndUpdate = jest.fn().mockResolvedValue(undefined);

    const fakeId = '507f1f77bcf86cd799439011';

    await service.incrementRedirectCount(fakeId);

    expect(mockLinkModel.findByIdAndUpdate).toHaveBeenCalledWith(fakeId, {
      $inc: { redirectCount: 1 },
    });
  });
});
