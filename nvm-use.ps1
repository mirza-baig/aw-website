#!/usr/bin/env pwsh
# This is a helper for NVM for Windows, which does not support the "use". On the Mac use the native NVM functionality.

if ($PSVersionTable.PSEdition -eq "Core" -and !$IsWindows) {
  Write-Host "This is a helper for NVM for Windows, which does not support the 'use' command." -ForegroundColor Red
  Write-Host "Please run the native 'nvm install && nvm use' commands directly." -ForegroundColor Red
  return
}

# Always use argument version if there is one
$versionDesired = $args[0]

if (($versionDesired -eq "" -Or $versionDesired -eq $null) -And (Test-Path .nvmrc -PathType Any)) {
  # if we have an nvmrc and no argument supplied, use the version in the file
  $versionDesired = $(Get-Content .nvmrc).replace( 'v', '' );
}
Write-Host "Requesting version '$($versionDesired)'"

if ($versionDesired -eq "" -Or $versionDesired -eq $null) {
  Write-Host "A node version needs specifying as an argument if there is no .nvmrc"
} else {
  $current = $(nvm current).replace( 'v', '' );
  if ($current -eq $versionDesired) {
    Write-Host "Already using requested version, nothing to do"
  } else {
    $response = nvm use $versionDesired;
    if ($response -match 'not installed') {
      if ($response -match '64-bit') {
        $response = nvm install $versionDesired x64
      } else {
        $response = nvm install $versionDesired x86
      }
      Write-Host $response

      $response = nvm use $versionDesired;
    }

    Write-Host $response
  }
}
