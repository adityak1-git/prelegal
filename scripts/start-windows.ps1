$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir

Write-Host "Building Prelegal Docker image..."
docker build -t prelegal $ProjectDir

Write-Host "Starting Prelegal container..."
docker run -d `
  --name prelegal `
  -p 8000:8000 `
  --env-file "$ProjectDir\.env" `
  prelegal

Write-Host "Prelegal is running at http://localhost:8000"
