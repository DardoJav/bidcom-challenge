import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { LinksService } from '../links.service';

@Injectable()
export class PasswordGuard implements CanActivate {
  constructor(private readonly linksService: LinksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const password = request.query.password as string | undefined;

    const link = await this.linksService.findByShortId(id);

    if (!link) throw new NotFoundException('Link not found');

    if (!link.valid) throw new NotFoundException('Invalid link');

    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      throw new NotFoundException('The link expired');
    }

    if (link.password) {
      if (!password || password !== link.password) {
        throw new ForbiddenException('Incorrect or missing password');
      }
    }

    request.link = link;

    return true;
  }
}
