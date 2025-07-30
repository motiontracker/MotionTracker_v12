import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { BullModule } from './common/bull/bull.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { SdkModule } from './sdk/sdk.module';
import { SystemLogModule } from './common/logs/system-log.module';
import { ContextModule } from './common/context/context.module';
import { GTMModule } from './gtm/gtm.module';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import * as path from 'path';
import { DashboardModule } from './dashboard/dashboard.module';
import { LeadsModule } from './leads/leads.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { DebugModule } from './debug/debug.module';
// Enhanced Analytics - Fase 3
import { AnalyticsModule as EnhancedAnalyticsModule } from './modules/analytics/analytics.module';
import { FacebookCampaignRulesModule } from './modules/facebook-campaign-rules/facebook-campaign-rules.module';
// Novas filas do sistema
import { QueuesModule } from './common/queues/queues.module';

/**
 * Módulo principal da aplicação MotionTracker
 * Configuração dos módulos base do sistema
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3001),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
        // Adicionando validação opcional para credenciais do Facebook
        FACEBOOK_APP_ID: Joi.string().optional().allow(''),
        FACEBOOK_APP_SECRET: Joi.string().optional().allow(''),
        FACEBOOK_REDIRECT_URI: Joi.string().optional().allow(''),
        FACEBOOK_OAUTH_REDIRECT_URI: Joi.string().optional().allow(''),
        // Adicionando validação opcional para credenciais do Google
        GOOGLE_CLIENT_ID: Joi.string().optional().allow(''),
        GOOGLE_CLIENT_SECRET: Joi.string().optional().allow(''),
        GOOGLE_REDIRECT_URI: Joi.string().optional().allow(''),
      }),
    }),
    BullModule,
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
    }),
    AuthModule,
    TenantModule,
    EventModule,
    IntegrationsModule,
    PrismaModule,
    ContextModule,
    SdkModule,
    SystemLogModule,
    DashboardModule,
    LeadsModule,
    AnalyticsModule,
    CampaignsModule,
    GTMModule,
    DebugModule,
    // Enhanced Analytics - Fase 3
    EnhancedAnalyticsModule,
    FacebookCampaignRulesModule,
    // Novas filas do sistema
    QueuesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    console.log(`Aplicação iniciada no ambiente: ${process.env.NODE_ENV || 'development'}`);
  }
}