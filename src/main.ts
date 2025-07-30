import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { TenantContext } from './common/context/tenant.context';
import * as jwt from 'jsonwebtoken';

// Adicionar logs de depuração para verificar o ambiente
console.log('=== INICIANDO APLICAÇÃO ===');
console.log('Diretório atual:', process.cwd());
console.log('Arquivos na raiz:', fs.readdirSync(process.cwd()));
console.log('Verificando arquivo .env:', fs.existsSync(path.join(process.cwd(), '.env')));
console.log('Conteúdo do .env:', fs.existsSync(path.join(process.cwd(), '.env')) ? 
  fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8') : 'Arquivo não encontrado');
console.log('Verificando NODE_ENV:', process.env.NODE_ENV);
console.log('Verificando PORT no process.env:', process.env.PORT);
console.log('Verificando DATABASE_URL:', process.env.DATABASE_URL);
console.log('Verificando JWT_SECRET:', process.env.JWT_SECRET ? 'Presente' : 'Ausente');
console.log('=== FIM DOS LOGS DE AMBIENTE ===');

/**
 * Configuração do servidor NestJS para o MotionTracker
 * ---------------------------------------------------
 * Este arquivo contém as configurações principais do servidor:
 * 
 * 1. CORS: Configurado para permitir solicitações do frontend 
 *    (localhost:3000) e qualquer origem em desenvolvimento
 * 
 * 2. Prefixos de API: Todas as rotas têm o prefixo /api por padrão
 * 
 * 3. Removida autenticação JWT para simplificar a aplicação
 */

// Middleware para verificar e configurar tenantId em requisições
function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const logger = new Logger('TenantMiddleware');
  const authHeader = req.headers.authorization;
  
  // Capturar tenantId para requisições da API SDK
  // Exemplo: /sdk/:tenantId.js
  const sdkMatch = req.path.match(/^\/sdk\/(.+)\.js$/);
  if (sdkMatch) {
    req['tenantId'] = sdkMatch[1];
    logger.debug(`SDK request for tenant: ${req['tenantId']}`);
    
    // Configurar o tenantContext usando o TenantContext do request
    const tenantContext = req['tenantContext'];
    if (tenantContext && tenantContext.setCurrentTenantId) {
      tenantContext.setCurrentTenantId(req['tenantId']);
      logger.debug(`TenantContext configurado para SDK request: ${req['tenantId']}`);
    }
  }
  
  // Para outras rotas, o tenantId geralmente vem do token JWT
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7); // Remover 'Bearer '
      
      // Configurar o JWT_SECRET
      const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';
      
      // Decodificar o token sem verificar para extrair o tenantId
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      if (decoded && decoded.tenantId) {
        req['tenantId'] = decoded.tenantId;
        logger.debug(`Tenant ID extraído do JWT: ${req['tenantId']}`);
        
        // Obter o TenantContext do request (injetado como middleware)
        const tenantContext = req['tenantContext'];
        if (tenantContext && tenantContext.setCurrentTenantId) {
          tenantContext.setCurrentTenantId(decoded.tenantId);
          logger.debug(`TenantContext configurado a partir do JWT: ${decoded.tenantId}`);
        } else {
          logger.warn('TenantContext não disponível no request');
        }
      } else {
        logger.warn('Token JWT não contém tenantId');
      }
    } catch (error) {
      logger.error(`Erro ao decodificar token JWT: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  next();
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Criar a aplicação NestJS
  const app = await NestFactory.create(AppModule);
  
  // Obter as configurações
  const configService = app.get(ConfigService);
  
  // Bull Board é configurado automaticamente via BullBoardModule
  
  // Definir o prefixo global para as rotas da API, excluindo Bull Board
  app.setGlobalPrefix('api', {
    exclude: ['/admin/queues'],
  });
  
  // Habilitar CORS para desenvolvimento E produção local
  const isDev = process.env.NODE_ENV !== 'production';
  const isLocalProduction = process.env.NODE_ENV === 'production' && process.env.CORS_ORIGIN === 'http://localhost:3000';
  
  app.enableCors({
    origin: isDev || isLocalProduction ? 'http://localhost:3000' : 'https://app.motiontracker.io',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  // Adicionar validação global para DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas com validadores
      transform: true, // Converte automaticamente tipos
      transformOptions: {
        enableImplicitConversion: true, // Permitir conversão implícita de tipos
      },
      forbidNonWhitelisted: true, // Rejeita requests com propriedades não decoradas
      disableErrorMessages: process.env.NODE_ENV === 'production', // Desabilita mensagens detalhadas em produção
      validationError: {
        target: false, // Não incluir o objeto alvo no erro
        value: false, // Não incluir o valor que falhou na validação
      },
      stopAtFirstError: false, // Continuar a validação mesmo após encontrar o primeiro erro
    }),
  );
  
  // Obter a porta do servidor
  const port = configService.get<number>('PORT', 3001);
  
  // Iniciar o servidor
  await app.listen(port);
  
  logger.log(`Servidor iniciado na porta ${port}`);
  logger.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`URL da API: http://localhost:${port}/api`);
}

bootstrap();