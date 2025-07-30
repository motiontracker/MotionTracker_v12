Write-Host "🚀 Iniciando deploy do MotionTracker..." -ForegroundColor Green

# Verificar se os builds existem
if (!(Test-Path "dist")) {
    Write-Host "❌ Diretório 'dist' não encontrado. Execute 'npm run build' primeiro." -ForegroundColor Red
    exit 1
}

if (!(Test-Path "frontend\.next")) {
    Write-Host "❌ Diretório 'frontend\.next' não encontrado. Execute 'cd frontend && npm run build' primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Criando pacote de deploy..." -ForegroundColor Yellow

# Criar lista de arquivos essenciais
$files = @(
    "dist/",
    "frontend/.next/",
    "frontend/public/",
    "package.json",
    "package-lock.json",
    "ecosystem.config.js",
    "prisma/",
    "src/",
    ".env"
)

# Verificar se tar está disponível
if (Get-Command tar -ErrorAction SilentlyContinue) {
    Write-Host "Usando tar para criar o pacote..." -ForegroundColor Blue
    tar -czf motiontracker-deploy.tar.gz @files
} else {
    Write-Host "Tar não encontrado. Usando 7-Zip ou Compress-Archive..." -ForegroundColor Blue
    Compress-Archive -Path $files -DestinationPath motiontracker-deploy.zip -Force
}

Write-Host "⬆️ Fazendo upload para VPS..." -ForegroundColor Yellow

# Upload usando SCP
if (Get-Command scp -ErrorAction SilentlyContinue) {
    if (Test-Path "motiontracker-deploy.tar.gz") {
        scp motiontracker-deploy.tar.gz root@206.81.2.132:/tmp/
    } else {
        scp motiontracker-deploy.zip root@206.81.2.132:/tmp/
    }
} else {
    Write-Host "❌ SCP não encontrado. Instale OpenSSH Client ou use WinSCP." -ForegroundColor Red
    Write-Host "Arquivo criado: motiontracker-deploy.tar.gz ou motiontracker-deploy.zip" -ForegroundColor Blue
    Write-Host "Faça upload manual para a VPS em /tmp/" -ForegroundColor Blue
    exit 1
}

Write-Host "🔧 Executando deploy na VPS..." -ForegroundColor Yellow

# Deploy na VPS via SSH
$deployScript = @'
cd /var/www
if [ ! -d "motiontracker" ]; then
    mkdir motiontracker
fi
cd motiontracker

echo "🛑 Parando aplicações..."
pm2 stop all 2>/dev/null || true

echo "📦 Extraindo arquivos..."
if [ -f "/tmp/motiontracker-deploy.tar.gz" ]; then
    tar -xzf /tmp/motiontracker-deploy.tar.gz
else
    unzip -o /tmp/motiontracker-deploy.zip
fi

echo "📦 Instalando dependências de produção..."
npm ci --only=production

echo "🚀 Iniciando aplicações..."
pm2 start ecosystem.config.js
pm2 save

echo "📊 Status das aplicações:"
pm2 status

echo "✅ Deploy concluído com sucesso!"
'@

if (Get-Command ssh -ErrorAction SilentlyContinue) {
    ssh root@206.81.2.132 $deployScript
} else {
    Write-Host "❌ SSH não encontrado. Execute os comandos manualmente na VPS:" -ForegroundColor Red
    Write-Host $deployScript -ForegroundColor Blue
}

Write-Host "✅ Deploy finalizado!" -ForegroundColor Green
Write-Host "🌐 Acesse: http://206.81.2.132" -ForegroundColor Cyan