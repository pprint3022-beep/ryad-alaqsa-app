# Ryad Al Aqsa — one-time setup (Windows PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

Write-Host "== Ryad Al Aqsa setup ==" -ForegroundColor Green
Write-Host "Node: $(node -v)"

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Host "pnpm not found. Trying corepack..." -ForegroundColor Yellow
  try { corepack enable; corepack prepare pnpm@9.1.0 --activate } catch {
    Write-Host "Corepack unavailable. Install pnpm: npm.cmd install -g pnpm" -ForegroundColor Yellow
  }
}

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
  Write-Host "Installing workspace dependencies..." -ForegroundColor Cyan
  pnpm install

  if (Test-Path "apps/api/prisma/schema.prisma") {
    Write-Host "Generating Prisma client..." -ForegroundColor Cyan
    pnpm --filter api prisma:generate
  }
} else {
  Write-Host "Skipping dependency install (pnpm missing)." -ForegroundColor Yellow
}

if (Test-Path "apps/web/.env.example") {
  if (-not (Test-Path "apps/web/.env")) { Copy-Item "apps/web/.env.example" "apps/web/.env" }
}
if (Test-Path "apps/api/.env.example") {
  if (-not (Test-Path "apps/api/.env")) { Copy-Item "apps/api/.env.example" "apps/api/.env" }
}

Write-Host ""
Write-Host "Done. Next steps:" -ForegroundColor Green
Write-Host "  Prototype:  cd backend; node server.js   -> http://localhost:3001"
Write-Host "  Web (dev):  pnpm --filter web dev        -> http://localhost:5173"
Write-Host "  API (dev):  pnpm --filter api dev        -> http://localhost:3001"
Write-Host "  Smoke:      node tests/prototype-smoke.js"
