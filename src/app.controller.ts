import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getStatus() {
    return {
      status: 'online',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      message: 'API do MotionTracker está funcionando corretamente',
    };
  }

  @Public()
  @Get('test-auth')
  testAuth() {
    return {
      status: 'success',
      message: 'Rota de teste de autenticação no AppController',
      timestamp: new Date().toISOString()
    };
  }

  @Public()
  @Post('test-login')
  testLogin(@Body() loginData: { email: string; password: string }) {
    return {
      status: 'success',
      message: 'Login de teste simulado com sucesso',
      timestamp: new Date().toISOString(),
      user: {
        email: loginData.email,
        role: 'USER'
      },
      access_token: 'test-token-123456789'
    };
  }
}