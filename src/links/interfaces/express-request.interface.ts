import { Request } from 'express';
import { Link } from '../entities/link.entity';

export interface RequestWithLink extends Request {
  link: Link;
}
