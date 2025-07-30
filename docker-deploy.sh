#!/bin/bash

# ===============================================
# MOTIONTRACKER - SCRIPT DE DEPLOY DOCKER
# ===============================================

set -e

echo "🚀 Iniciando deploy do MotionTracker..."

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "📝 Copie o arquivo env.example para .env e configure as variáveis:"
    echo "   cp env.example .env"
    echo "   nano .env"
    exit 1
fi

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.production.yml down || true

# Remover imagens antigas (opcional)
read -p "🗑️  Remover imagens antigas para rebuild completo? (y/N): " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removendo imagens antigas..."
    docker rmi motiontracker_v12_backend motiontracker_v12_frontend || true
fi

# Build das imagens
echo "🔨 Fazendo build das imagens..."
docker-compose -f docker-compose.production.yml build --no-cache

# Iniciar serviços
echo "🚀 Iniciando serviços..."
docker-compose -f docker-compose.production.yml up -d

# Aguardar serviços ficarem saudáveis
echo "⏳ Aguardando serviços ficarem saudáveis..."
sleep 30

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose -f docker-compose.production.yml ps

# Mostrar logs iniciais
echo "📋 Logs iniciais do backend:"
docker-compose -f docker-compose.production.yml logs --tail=20 backend

echo "📋 Logs iniciais do frontend:"
docker-compose -f docker-compose.production.yml logs --tail=20 frontend

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🌐 URLs disponíveis:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   Queue Dashboard: http://localhost:3002"
echo "   Prometheus: http://localhost:9090"
echo "   Grafana: http://localhost:3003"
echo ""
echo "📝 Para monitorar logs:"
echo "   docker-compose -f docker-compose.production.yml logs -f"
echo ""
echo "🛑 Para parar todos os serviços:"
echo "   docker-compose -f docker-compose.production.yml down"