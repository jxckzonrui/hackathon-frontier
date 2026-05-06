param(
  [string]$RuntimeDir = "C:\qvacrt2",
  [int]$Port = 11434,
  [switch]$PrepareOnly
)

$ErrorActionPreference = "Stop"

$repoConfig = Join-Path $PSScriptRoot "..\qvac.config.json"
$runtimeConfig = Join-Path $RuntimeDir "qvac.config.json"

if (-not (Test-Path $RuntimeDir)) {
  New-Item -ItemType Directory -Path $RuntimeDir | Out-Null
}

Push-Location $RuntimeDir
try {
  if (-not (Test-Path "package.json")) {
    npm.cmd init -y | Out-Null
  }

  if (-not (Test-Path "node_modules\@qvac\sdk") -or -not (Test-Path "node_modules\@qvac\cli")) {
    npm.cmd install @qvac/sdk@0.10.0 @qvac/cli@0.2.4 bare-runtime-win32-x64@1.28.4 bare-https@2.1.3
  }

  Copy-Item -LiteralPath $repoConfig -Destination $runtimeConfig -Force

  if ($PrepareOnly) {
    Write-Output "QVAC runtime prepared at $RuntimeDir"
    exit 0
  }

  npx.cmd qvac serve openai --host 127.0.0.1 --port $Port
}
finally {
  Pop-Location
}
