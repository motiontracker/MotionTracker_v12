# 🐳 MotionTracker - Guia Docker

Este guia explica como usar o Docker para deploy do MotionTracker em produção.

## 📋 Pré-requisitos

- **Docker**: 24.0+ 
- **Docker Compose**: 2.20+
- **Memória**: Mínimo 4GB RAM disponível para containers
- **Disco**: Mínimo 10GB livres

## 🚀 Deploy Rápido

### 1. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar com seus valores reais
nano .env  # ou notepad .env no Windows
```

**⚠️ IMPORTANTE**: Configure todas as variáveis obrigatórias:
- `DATABASE_URL` (Supabase)
- `REDIS_URL`
- `JWT_SECRET`
- `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `FRONTEND_URL`, `CORS_ORIGINS`

### 2. Executar Deploy

**Linux/Mac:**
```bash
./docker-deploy.sh
```

**Windows PowerShell:**
```powershell
.\docker-deploy.ps1
```

**Manual:**
```bash
docker-compose -f docker-compose.production.yml up -d --build
```

## 🌐 URLs de Acesso

Após o deploy bem-sucedido:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Queue Dashboard**: http://localhost:3002
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3003

## 📊 Monitoramento

### Verificar Status dos Serviços
```bash
docker-compose -f docker-compose.production.yml ps
```

### Ver Logs em Tempo Real
```bash
# Todos os serviços
docker-compose -f docker-compose.production.yml logs -f

# Apenas backend
docker-compose -f docker-compose.production.yml logs -f backend

# Apenas frontend
docker-compose -f docker-compose.production.yml logs -f frontend
```

### Health Checks
```bash
# Backend
curl http://localhost:3001/api/health

# Frontend
curl http://localhost:3000

# Redis
docker exec motiontracker_redis redis-cli ping
```

## 🔧 Comandos Úteis

### Parar Todos os Serviços
```bash
docker-compose -f docker-compose.production.yml down
```

### Rebuild Completo
```bash
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d
```

### Backup do Redis
```bash
docker exec motiontracker_redis redis-cli BGSAVE
docker cp motiontracker_redis:/data/dump.rdb ./backup-redis-$(date +%Y%m%d).rdb
```

### Acessar Container
```bash
# Backend
docker exec -it motiontracker_backend sh

# Frontend
docker exec -it motiontracker_frontend sh

# Redis
docker exec -it motiontracker_redis redis-cli
```

## 🐛 Troubleshooting

### Container não inicia
1. Verificar logs: `docker-compose logs [service_name]`
2. Verificar arquivo `.env`
3. Verificar portas em uso: `netstat -tulpn | grep :3000`

### Problema de memória
```bash
# Limpar containers parados
docker container prune

# Limpar imagens não utilizadas
docker image prune

# Limpar volumes não utilizados
docker volume prune
```

### Rebuild apenas um serviço
```bash
# Apenas backend
docker-compose -f docker-compose.production.yml build backend
docker-compose -f docker-compose.production.yml up -d backend

# Apenas frontend
docker-compose -f docker-compose.production.yml build frontend
docker-compose -f docker-compose.production.yml up -d frontend
```

### Redis não conecta
1. Verificar se está rodando: `docker ps | grep redis`
2. Verificar logs: `docker logs motiontracker_redis`
3. Testar conexão: `docker exec motiontracker_redis redis-cli ping`

## 📁 Estrutura de Arquivos Docker

```
MotionTracker_v12/
├── Dockerfile                 # Backend (NestJS)
├── docker-compose.yml         # Desenvolvimento
├── docker-compose.production.yml  # Produção
├── docker-deploy.sh           # Script deploy Linux/Mac
├── docker-deploy.ps1          # Script deploy Windows
├── env.example                # Variáveis de ambiente
├── redis.conf                 # Configuração Redis
├── nginx/
│   ├── nginx.conf            # Configuração principal
│   └── sites-available/
│       └── motiontracker     # Site configuration
├── monitoring/
│   ├── prometheus.yml        # Configuração Prometheus
│   └── grafana/
│       └── provisioning/     # Configuração Grafana
└── frontend/
    └── Dockerfile.production  # Frontend (Next.js)
```

## 🔐 Configuração de Produção

Para produção real (não localhost):

1. **SSL/HTTPS**: Configure certificados SSL no nginx
2. **Domínio**: Atualize `server_name` no nginx
3. **Firewall**: Configure apenas portas 80/443 públicas
4. **Backup**: Configure backup automático do Redis e Logs
5. **Monitoramento**: Configure alertas no Grafana

## 📞 Suporte

Se encontrar problemas:

1. Verifique logs dos containers
2. Verifique configuração `.env`
3. Verifique recursos do sistema (RAM/CPU/Disco)
4. Consulte documentação do Docker Compose