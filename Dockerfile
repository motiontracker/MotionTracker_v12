# ===============================================
# MOTIONTRACKER - DOCKERFILE PARA PRODUÇÃO
# ===============================================
# Multi-stage build para otimização de tamanho

# ===============================================
# STAGE 1: Build Dependencies
# ===============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Instalar dependências
RUN npm install && npm cache clean --force
RUN cd frontend && npm install && npm cache clean --force

# ===============================================
# STAGE 2: Build Application
# ===============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build do backend
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Build do frontend
WORKDIR /app/frontend
RUN npm run build

# ===============================================
# STAGE 3: Production Runtime
# ===============================================
FROM node:20-alpine AS runner

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 motiontracker

WORKDIR /app

# Instalar PM2 globalmente e curl para healthcheck
RUN npm install -g pm2 && \
    apk add --no-cache curl

# Copiar dependências necessárias do 'builder' que já contém o Prisma Client gerado
COPY --from=builder --chown=motiontracker:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=motiontracker:nodejs /app/frontend/node_modules ./frontend/node_modules

# Copiar arquivos buildados
COPY --from=builder --chown=motiontracker:nodejs /app/dist ./dist
COPY --from=builder --chown=motiontracker:nodejs /app/frontend/.next ./frontend/.next
COPY --from=builder --chown=motiontracker:nodejs /app/frontend/public ./frontend/public

# Copiar arquivos de configuração
COPY --chown=motiontracker:nodejs package.json ./
COPY --chown=motiontracker:nodejs ecosystem.config.js ./
COPY --chown=motiontracker:nodejs prisma ./prisma

# Criar diretórios necessários
RUN mkdir -p logs && chown motiontracker:nodejs logs

# Mudar para usuário não-root
USER motiontracker

# Expor portas
EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Comando de inicialização
CMD ["pm2-runtime", "start", "ecosystem.config.js"]