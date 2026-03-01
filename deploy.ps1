param(
    [string]$Runtime = "win-x64",
    [string]$Configuration = "Release",
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
Write-Host "Workspace root: $root" -ForegroundColor Cyan

# 1. Determine version: prefer frontend package.json version, fallback to timestamp
$clientPkg = Join-Path $root "Monitoring-Frontend\package.json"
$timestamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$version = $timestamp
if (Test-Path $clientPkg) {
    try {
        $pkg = Get-Content $clientPkg -Raw | ConvertFrom-Json
        if ($pkg.version -and ($pkg.version -ne "0.0.0")) {
            $version = $pkg.version
        }
        else {
            $version = "$($pkg.version)-$timestamp"
        }
    }
    catch {
        Write-Warning "Could not parse package.json; using timestamp version $version"
    }
}

$deployRoot = Join-Path $root "deploy"
$target = Join-Path $deployRoot $version

if (Test-Path $target) {
    if ($Force) {
        Write-Host "Removing existing target: $target" -ForegroundColor Yellow
        Remove-Item $target -Recurse -Force
    }
    else {
        Write-Host "Target $target already exists. Use -Force to overwrite. Exiting." -ForegroundColor Red
        exit 1
    }
}

New-Item -Path $target -ItemType Directory -Force | Out-Null

# 2. Check prerequisites
Write-Host "`n=== Checking Prerequisites ===" -ForegroundColor Cyan
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Error "dotnet not found in PATH. Install .NET SDK and retry."
    exit 1
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm not found in PATH. Install Node.js and retry."
    exit 1
}
Write-Host "Prerequisites OK." -ForegroundColor Green

# 3. Build & Publish Application (Self-Contained)
# Note: Monitoring.API.csproj is already configured to build the frontend during publish.
$apiProj = Join-Path $root "Monitoring.Backend\Monitoring.API\Monitoring.API.csproj"
if (-not (Test-Path $apiProj)) {
    Write-Error "API project not found at $apiProj"
    exit 1
}

$destBack = Join-Path $target "backend"
New-Item -Path $destBack -ItemType Directory -Force | Out-Null

Write-Host "`n=== Publishing Application (Self-Contained) ===" -ForegroundColor Cyan
Write-Host "dotnet publish $apiProj -c $Configuration -r $Runtime --self-contained true -o $destBack"
try {
    dotnet publish $apiProj -c $Configuration -r $Runtime --self-contained true -o $destBack
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Application publish failed with exit code $LASTEXITCODE"
        exit 1
    }
    Write-Host "Application published to $destBack" -ForegroundColor Green
}
catch {
    Write-Error "dotnet publish failed: $_"
    exit 1
}

# 4. Create a simple run script in the version folder
$RunScript = @"
Write-Host "Starting Monitoring App..." -ForegroundColor Cyan
cd backend
.\Monitoring.API.exe
"@
$RunScript | Out-File -FilePath (Join-Path $target "run.ps1")

Write-Host "`n=== Done ===" -ForegroundColor Cyan
Write-Host "Deployed version: $version"
Write-Host "Output folder: $target" -ForegroundColor Green
Write-Host "To run: $target\run.ps1 or double-click $target\backend\Monitoring.API.exe"
