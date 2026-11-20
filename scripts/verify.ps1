# Ryad Al Aqsa — verification (Windows PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File scripts/verify.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

function Step($name) { Write-Host "`n== $name ==" -ForegroundColor Cyan }

Step "JavaScript syntax"
node --check backend/server.js
node --check app.js
node --check i18n.js
node --check tests/prototype-smoke.js
if (Test-Path "tests/prototype-extended.js") { node --check tests/prototype-extended.js }
Write-Host "syntax OK" -ForegroundColor Green

Step "JSON files"
node -e "for (const f of ['manifest.json','backend/data.json','apps/api/package.json','apps/web/package.json','packages/shared/package.json']) { JSON.parse(require('fs').readFileSync(f,'utf8')); console.log('ok', f) }"

Step "Branding"
node -e "const s=require('fs').readFileSync('logo.svg','utf8'); if(!s.includes('<svg')) process.exit(1); console.log('logo.svg', s.length, 'bytes')"
node -e "const fs=require('fs'); const hits=[]; for (const f of ['README.md','index.html','styles.css','app.js','manifest.json']) { const s=fs.readFileSync(f,'utf8'); if(/duolingo/i.test(s)) hits.push(f) } if(hits.length){console.error('Duolingo mention in',hits);process.exit(1)} console.log('no Duolingo mentions')"

node -e "const fs=require('fs'); const files=['en','ar','fr','amz'].map(l=>'apps/web/src/i18n/locales/'+l+'.ts'); const sets=files.map(f=>new Set([...fs.readFileSync(f,'utf8').matchAll(/^  ([A-Za-z0-9_]+):/gm)].map(m=>m[1]))); const base=sets[0]; for(const [i,s] of sets.entries()){const miss=[...base].filter(k=>!s.has(k));const extra=[...s].filter(k=>!base.has(k)); if(miss.length||extra.length){console.error(files[i],'missing',miss.slice(0,5),'extra',extra.slice(0,5));process.exit(1)}} console.log('i18n keys',base.size,'identical across 4 locales')"

Step "Prototype smoke (41 checks)"
node tests/prototype-smoke.js

Step "Prototype extended QA (83 checks)"
$qaBackup = Join-Path $env:TEMP 'ryad-data-verify-backup.json'
Copy-Item backend/data.json $qaBackup -Force
try {
  node tests/prototype-extended.js
} finally {
  Copy-Item $qaBackup backend/data.json -Force
  Write-Host "demo data restored" -ForegroundColor Green
}

Write-Host "`nAll verifications completed." -ForegroundColor Green
