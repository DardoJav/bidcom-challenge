import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Link } from './entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { generateShortId } from '../utils/id-generator';

@Injectable()
export class LinksService {
  constructor(
    @InjectModel(Link.name) private readonly linkModel: Model<Link>,
  ) {}

  async create(dto: CreateLinkDto) {
    const shortId = generateShortId();

    const newLink = new this.linkModel({
      originalUrl: dto.url,
      shortId,
      password: dto.password,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    });

    await newLink.save();

    return {
      target: newLink.originalUrl,
      link: `http://localhost:3000/l/${shortId}`,
      valid: newLink.valid,
    };
  }

  async findByShortId(shortId: string) {
    return this.linkModel.findOne({ shortId });
  }

  async incrementRedirectCount(id: string) {
    await this.linkModel.findByIdAndUpdate(id, { $inc: { redirectCount: 1 } });
  }

  async invalidate(shortId: string) {
    const link = await this.linkModel.findOne({ shortId });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    link.valid = false;
    await link.save();

    return {
      message: 'Link invalidated correctly',
      shortId,
    };
  }

  async getStats(shortId: string) {
    const link = await this.linkModel.findOne({ shortId });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return {
      shortId: link.shortId,
      originalUrl: link.originalUrl,
      redirectCount: link.redirectCount,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt,
      valid: link.valid,
    };
  }
}
