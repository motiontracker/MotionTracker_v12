# 🚀 GUIA DE DEPLOY EM PRODUÇÃO - MOTIONTRACKER

Este guia segue as melhores práticas para deploy seguro em produção.

## 📋 PRÉ-REQUISITOS

### Servidor (VPS/Dedicated)
- **OS**: Ubuntu 20.04+ ou CentOS 8+
- **CPU**: 2 cores mínimo (4 cores recomendado)
- **RAM**: 4GB mínimo (8GB recomendado)
- **Storage**: 20GB mínimo (SSD recomendado)
- **Node.js**: v18.x ou superior
- **PM2**: Gerenciador de processos

### Serviços Externos
- **PostgreSQL**: 14+ (local ou RDS)
- **Redis**: 6+ (local ou ElastiCache)
- **SSL**: Certificado válido (Let's Encrypt recomendado)
- **DNS**: Domínio configurado

## 🔧 PREPARAÇÃO DO SERVIDOR

### 1. Atualizar Sistema
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl wget git build-essential -y
```

### 2. Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Instalar PM2
```bash
sudo npm install -g pm2
pm2 startup
```

### 4. Instalar PostgreSQL (se local)
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 5. Instalar Redis (se local)
```bash
sudo apt install redis-server -y
sudo systemctl start redis
sudo systemctl enable redis
```

## 📦 DEPLOY DO SISTEMA

### 1. Clone do Repositório
```bash
cd /var/www
sudo mkdir motiontracker
sudo chown $USER:$USER motiontracker
cd motiontracker

git clone https://github.com/motiontracker/motiontracker-v12.git .
```

### 2. Configuração de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar variáveis (use vim, nano ou outro editor)
nano .env
```

**⚠️ IMPORTANTE**: Configure todas as variáveis com valores reais de produção!

### 3. Instalar Dependências
```bash
# Backend
npm ci --only=production

# Frontend
cd frontend
npm ci --only=production
cd ..
```

### 4. Configurar Banco de Dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Verificar conexão
npx prisma db push
```