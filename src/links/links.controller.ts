import { Body, Controller, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { LinksService } from './links.service';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PasswordGuard } from './guards/password.guard';
import { Response } from 'express';
import { RequestWithLink } from './interfaces/express-request.interface';

@ApiTags('Links')
@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('create')
  create(@Body() dto: CreateLinkDto) {
    return this.linksService.create(dto);
  }

  @Get('l/:id')
  @ApiQuery({ name: 'password', required: false })
  @UseGuards(PasswordGuard)
  async redirect(@Param('id') id: string, @Query('password') password: string, @Res() res: Response, @Req() req: RequestWithLink) {
    const link = req.link;

    await this.linksService.incrementRedirectCount(link._id as string);

    return res.redirect(link.originalUrl);
  }

  @Put('invalidate/:id')
  @ApiParam({ name: 'id', description: 'ID of the link to invalidate' })
  async invalidate(@Param('id') id: string) {
    return this.linksService.invalidate(id);
  }

  @Get('l/:id/stats')
  @ApiParam({ name: 'id', description: 'ID of the link to get stats' })
  async getStats(@Param('id') id: string) {
    return this.linksService.getStats(id);
  }
  
}
