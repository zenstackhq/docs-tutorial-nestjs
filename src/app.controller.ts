import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    @Inject(ENHANCED_PRISMA) private readonly prismaService: PrismaService,
  ) {}

  @Post('users')
  async signup(@Body() userData: { name: string }) {
    return this.prismaService.user.create({ data: userData });
  }

  @Get('posts')
  async getAllPosts() {
    return this.prismaService.post.findMany();
  }

  @Post('posts')
  async createDraft(@Body() postData: { title: string; authorId: number }) {
    return this.prismaService.post.create({
      data: postData,
    });
  }

  @Put('posts/publish/:id')
  async publishPost(@Param('id') id: string) {
    return this.prismaService.post.update({
      where: { id: Number(id) },
      data: { published: true },
    });
  }
}
