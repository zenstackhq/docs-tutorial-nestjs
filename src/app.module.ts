import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { enhance } from '@zenstackhq/runtime';
import { ZenStackModule } from '@zenstackhq/server/nestjs';
import { ClsModule, ClsService } from 'nestjs-cls';
import { AppController } from './app.controller';
import { AuthInterceptor } from './auth.interceptor';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),

    ZenStackModule.registerAsync({
      useFactory: (prisma: PrismaService, cls: ClsService) => {
        return {
          getEnhancedPrisma: () => enhance(prisma, { user: cls.get('auth') }),
        };
      },
      inject: [PrismaService, ClsService],
      extraProviders: [PrismaService],
    }),
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
})
export class AppModule {}
