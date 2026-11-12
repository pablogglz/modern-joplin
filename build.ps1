# Packages each plugin as dist\<id>.jpl (a .jpl is a .tar). Usage: .\build.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force dist | Out-Null
foreach ($d in 'features', 'theme') {
  $id = (Get-Content "$d\manifest.json" -Raw | ConvertFrom-Json).id
  Push-Location $d
  tar -cf "..\dist\$id.jpl" *
  Pop-Location
  "dist\$id.jpl"
}
