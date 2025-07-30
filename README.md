# MotionTracker

Sistema completo de rastreamento de eventos multi-tenant com integrações Facebook CAPI, Google Analytics 4 e Google Tag Manager.

## 🚀 Características Principais

- **Multi-tenant**: Suporte completo para múltiplos inquilinos
- **Event Tracking**: Rastreamento em tempo real de eventos do usuário
- **Facebook CAPI**: Integração completa com Conversions API
- **Google Analytics 4**: Integração nativa com GA4
- **Google Tag Manager**: Suporte server-side
- **Queue Processing**: Processamento assíncrono com BullMQ
- **Dashboard Modular**: Interface moderna com métricas em tempo real

## 🏧 Arquitetura

### Backend (NestJS)
- **Framework**: NestJS com TypeScript
- **Database**: PostgreSQL com Prisma ORM
- **Queue**: Redis + BullMQ para processamento assíncrono
- **Auth**: JWT com estratégias customizadas
- **Monitoring**: Métricas de qualidade e performance

### Frontend (Next.js)
- **Framework**: Next.js 14 com App Router
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Theme**: Sistema de dark/light mode nativo

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Backend
```bash
cd src/
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

### Frontend
```bash
cd frontend/
npm install
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://localhost:6379"

# Facebook
FACEBOOK_APP_ID="your_app_id"
FACEBOOK_APP_SECRET="your_app_secret"
FACEBOOK_VERIFY_TOKEN="your_verify_token"

# Google
GOOGLE_ANALYTICS_PROPERTY_ID="your_property_id"
GTM_CONTAINER_ID="GTM-XXXXXXX"

# JWT
JWT_SECRET="your_jwt_secret"
```

### Facebook Setup

1. Crie um app no Facebook Developers
2. Configure o Conversions API
3. Adicione o domínio verificado
4. Configure os eventos customizados

Veja [docs/FACEBOOK_SETUP.md](docs/FACEBOOK_SETUP.md) para instruções detalhadas.

## 🎯 Funcionalidades

### Rastreamento de Eventos
- Eventos padrão (PageView, Purchase, Lead, etc.)
- Eventos customizados
- Deduplicacão automática
- Validação de payload

### Integrações
- **Facebook CAPI**: Event Match Score, Deduplication
- **Google Analytics**: Enhanced Ecommerce, Custom Events
- **WhatsApp Business**: Attribution tracking

### Dashboard
- Métricas em tempo real
- Análise de qualidade de eventos
- Status de integrações
- Campanhas unificadas
- Leads gerados

### Campanhas
- Criação unificada Facebook/Google
- Targeting por localização
- Otimização automática
- ROI tracking

## 🔄 Fluxo de Dados

```
SDK/Frontend → Event Ingestion → Queue → Platform Processors → External APIs
                     ↓
              Database Storage ← Event Validation ← Data Enrichment
```

## 📊 Monitoramento

### Métricas Disponíveis
- Event Match Score (Facebook)
- Deduplication Rate
- Processing Latency
- Error Rates
- Conversion Tracking

### Health Checks
- Database connectivity
- Redis status
- External API availability
- Queue processing status

## 🧪 Testing

```bash
# Backend tests
npm run test

# E2E tests
npm run test:e2e

# Frontend tests
cd frontend/
npm run test
```

## 📚 Documentação

- [Facebook Setup](docs/FACEBOOK_SETUP.md)
- [API Rate Limiting](docs/facebook-api-rate-limiting.md)
- [Campaign Rules](docs/facebook-campaign-rules.md)
- [OAuth Flow](docs/facebook-ads-oauth.md)

## 🚀 Produção

### Docker
```bash
docker-compose up -d
```

### Env de Produção
- Configure SSL/TLS
- Use Redis Cluster
- Configure monitoring (DataDog, New Relic)
- Setup backup automático

## 📝 Licença

Proprietary - MotionTracker Studio

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento.