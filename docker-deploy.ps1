# ===============================================
# MOTIONTRACKER - SCRIPT DE DEPLOY DOCKER (POWERSHELL)
# ===============================================

Write-Host "🚀 Iniciando deploy do MotionTracker..." -ForegroundColor Green

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "📝 Copie o arquivo env.example para .env e configure as variáveis:" -ForegroundColor Yellow
    Write-Host "   Copy-Item env.example .env" -ForegroundColor Cyan
    Write-Host "   notepad .env" -ForegroundColor Cyan
    exit 1
}

# Verificar se o Docker está rodando
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker não está rodando. Inicie o Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
docker-compose -f docker-compose.production.yml down

# Remover imagens antigas (opcional)
$rebuild = Read-Host "🗑️  Remover imagens antigas para rebuild completo? (y/N)"
if ($rebuild -eq "y" -or $rebuild -eq "Y") {
    Write-Host "🗑️  Removendo imagens antigas..." -ForegroundColor Yellow
    docker rmi motiontracker_v12_backend motiontracker_v12_frontend -ErrorAction SilentlyContinue
}

# Build das imagens
Write-Host "🔨 Fazendo build das imagens..." -ForegroundColor Cyan
docker-compose -f docker-compose.production.yml build --no-cache

# Iniciar serviços
Write-Host "🚀 Iniciando serviços..." -ForegroundColor Green
docker-compose -f docker-compose.production.yml up -d

# Aguardar serviços ficarem saudáveis
Write-Host "⏳ Aguardando serviços ficarem saudáveis..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar status dos containers
Write-Host "📊 Status dos containers:" -ForegroundColor Cyan
docker-compose -f docker-compose.production.yml ps

# Mostrar logs iniciais
Write-Host "📋 Logs iniciais do backend:" -ForegroundColor Cyan
docker-compose -f docker-compose.production.yml logs --tail=20 backend

Write-Host "📋 Logs iniciais do frontend:" -ForegroundColor Cyan
docker-compose -f docker-compose.production.yml logs --tail=20 frontend

Write-Host ""
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs disponíveis:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "   Queue Dashboard: http://localhost:3002" -ForegroundColor White
Write-Host "   Prometheus: http://localhost:9090" -ForegroundColor White
Write-Host "   Grafana: http://localhost:3003" -ForegroundColor White
Write-Host ""
Write-Host "📝 Para monitorar logs:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.production.yml logs -f" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛑 Para parar todos os serviços:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.production.yml down" -ForegroundColor Cyan