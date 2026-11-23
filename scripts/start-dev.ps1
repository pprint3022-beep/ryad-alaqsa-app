# تشغيل الواجهة والـ API معاً للتطوير المحلي / على الشبكة المحلية
# الاستخدام: من مجلد ryad-alaqsa-app ->  powershell -ExecutionPolicy Bypass -File scripts\start-dev.ps1

$root = Split-Path -Parent $PSScriptRoot

# منع تشغيل نسخ مكررة
foreach ($port in @(5173, 3001)) {
  $busy = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if ($busy) { Write-Host "المنفذ $port مستخدم بالفعل (PID $($busy.OwningProcess))" -ForegroundColor Yellow }
}

Write-Host "بدء الـ API على http://localhost:3001 ..." -ForegroundColor Green
Start-Process -FilePath 'node' -ArgumentList 'backend/server.js' -WorkingDirectory $root

Write-Host "بدء الواجهة على http://localhost:5173 ..." -ForegroundColor Green
Start-Process -FilePath 'npm.cmd' -ArgumentList 'run dev' -WorkingDirectory $root

Write-Host ""
Write-Host "الحسابات التجريبية (كلمة المرور: 1234):" -ForegroundColor Cyan
Write-Host "  director@ryad.ma   (مدير)"
Write-Host "  teacher@ryad.ma    (أستاذ)"
Write-Host "  parent@ryad.ma     (ولي أمر)"
Write-Host "  student@ryad.ma    (تلميذ)"
Write-Host ""
Write-Host "من الهاتف: http://192.168.1.37:5173  (نفس شبكة Wi-Fi)"
