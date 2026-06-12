#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop";

Write-Host "Preparing your development environment!" -ForegroundColor Green

# Set the root of the repository
$RepoRoot = Resolve-Path "$PSScriptRoot"

################################################
# Retrieve and import SitecoreDockerTools module
################################################

# Check for Sitecore Gallery
Import-Module PowerShellGet
$SitecoreGallery = Get-PSRepository | Where-Object { $_.SourceLocation -eq "https://nuget.sitecore.com/resources/v2" }
if (-not $SitecoreGallery) {
    Write-Host "Adding Sitecore PowerShell Gallery..." -ForegroundColor Green
    Unregister-PSRepository -Name SitecoreGallery -ErrorAction SilentlyContinue
    Register-PSRepository -Name SitecoreGallery -SourceLocation https://nuget.sitecore.com/resources/v2 -InstallationPolicy Trusted
    $SitecoreGallery = Get-PSRepository -Name SitecoreGallery
}

# Install and Import SitecoreDockerTools
$dockerToolsVersion = "10.2.7"
Remove-Module SitecoreDockerTools -ErrorAction SilentlyContinue
if (-not (Get-InstalledModule -Name SitecoreDockerTools -RequiredVersion $dockerToolsVersion -ErrorAction SilentlyContinue)) {
    Write-Host "Installing SitecoreDockerTools..." -ForegroundColor Green
    Install-Module SitecoreDockerTools -RequiredVersion $dockerToolsVersion -Scope CurrentUser -Repository $SitecoreGallery.Name
}
Write-Host "Importing SitecoreDockerTools..." -ForegroundColor Green
Import-Module SitecoreDockerTools -RequiredVersion $dockerToolsVersion

###############################
# Setup .env and .env.local
###############################

$envFileLocation = "$RepoRoot/.env.local"
if (-not (Test-Path $envFileLocation)) {
    "" | Out-File -Path $envFileLocation
}

##########################################
# Add the .gitconfig to the local settings
##########################################
Write-Host "Configuring Git to include the .gitconfig file..." -ForegroundColor Green
git config --local include.path ../.gitconfig

##########################################
# Install node
##########################################
Write-Host "Installing NodeJS..." -ForegroundColor Green
& ./nvm-use.ps1

##########################################
# Install node modules
##########################################
Write-Host "Installing Node modules..." -ForegroundColor Green
& npm install

##########################################
# Install Husky
##########################################
Write-Host "Installing Husky..." -ForegroundColor Green
& npm run prepare

###############################
# Populate the environment file
###############################
Write-Host "Populating required .env file values..." -ForegroundColor Green

Set-EnvFileVariable "NEXT_PUBLIC_EW_ENVIRONMENT" -Value "Local" -Path $envFileLocation

Set-EnvFileVariable "AW_XM_CLOUD_REPO_PATH" -Value "../xmcloud" -Path $envFileLocation

Set-EnvFileVariable "DISABLE_SSG_FETCH" -Value "true" -Path $envFileLocation

Set-EnvFileVariable "SITECORE_EDGE_CONTEXT_ID" -Value "" -Path $envFileLocation
Set-EnvFileVariable "JSS_EDITING_SECRET" -Value "" -Path $envFileLocation
Set-EnvFileVariable "SITECORE_API_KEY" -Value "" -Path $envFileLocation
Set-EnvFileVariable "SITECORE_API_HOST" -Value "https://xmcloudcm.localhost" -Path $envFileLocation
Set-EnvFileVariable "#DEBUG" -Value "sitecore-jss:*" -Path $envFileLocation

Write-Host
Write-Host ("#" * 75) -ForegroundColor Cyan
Write-Host "Update the following variables in .env.local from your xmcloud local." -ForegroundColor Cyan
Write-Host " - AW_XM_CLOUD_REPO_PATH - path to the xmcloud on your local"
Write-Host " - SITECORE_API_KEY - the generated value from your xmcloud .env.local"
Write-Host " - JSS_EDITING_SECRET - the generated value from your xmcloud .env.local"
Write-Host ("#" * 75) -ForegroundColor Cyan

Write-Host "Done!" -ForegroundColor Green
