$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    npm run dev
    if ($LASTEXITCODE -ne 0) { throw "Quartz exited with code $LASTEXITCODE" }
} finally {
    Pop-Location
}
