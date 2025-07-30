# 🚀 CHECKLIST DE DEPLOY PRODUÇÃO - MOTIONTRACKER

## 📋 PRÉ-REQUISITOS

### ✅ Servidor
- [ ] VPS/Servidor com Ubuntu 20.04+ ou CentOS 8+
- [ ] Mínimo 4GB RAM, 2 CPU cores, 20GB storage
- [ ] Acesso root/sudo configurado
- [ ] Domínio configurado e apontando para o servidor

### ✅ Serviços Externos
- [ ] Facebook App configurado (App ID, App Secret, Pixel ID)
- [ ] Google Cloud Project (Analytics, Ads, OAuth)
- [ ] Certificados SSL (Let's Encrypt ou próprio)
- [ ] Email SMTP configurado (Gmail, SendGrid, etc.)

## 🔧 INSTALAÇÃO BASE

### ✅ Sistema Operacional
```bash
# 1. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Executar script de instalação
chmod +x scripts/install-vps.sh
sudo ./scripts/install-vps.sh
```

### ✅ Docker (Opcional)
```bash
# Se escolheu Docker durante instalação
sudo systemctl status docker
docker --version
docker-compose --version
```

## 📦 DEPLOY DA APLICAÇÃO

### ✅ Clone do Repositório
```bash
cd /var/www/motiontracker
git clone https://github.com/your-org/motiontracker-v12.git .
```

### ✅ Configuração do Ambiente
```bash
# 1. Copiar arquivo de exemplo
cp .env.example .env

# 2. Editar variáveis (CRÍTICO!)
nano .env
```

**⚠️ IMPORTANTE**: Configure todas as variáveis obrigatórias:
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET` (gerar novo!)
- `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `FRONTEND_URL` (URL final do site)
- `CORS_ORIGINS` (URL final do site)

### ✅ Instalação de Dependências
```bash
# Backend
npm ci --only=production

# Frontend
cd frontend
npm ci --only=production
cd ..
```

### ✅ Banco de Dados
```bash
# 1. Gerar Prisma Client
npx prisma generate

# 2. Executar migrações
npx prisma migrate deploy

# 3. (Opcional) Verificar conexão
npx prisma studio --browser none
```

## 🚀 INICIALIZAÇÃO DOS SERVIÇOS

### ✅ Método 1: PM2 (Recomendado)
```bash
# 1. Build da aplicação
npm run build
cd frontend && npm run build && cd ..

# 2. Iniciar com PM2
pm2 start ecosystem.config.js

# 3. Verificar status
pm2 status
pm2 logs
```