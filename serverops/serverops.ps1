#!/usr/local/bin/pwsh

# This is a log pruning application written in Powershell that queries Spice AI
# for intelligent recommendations on when it would be a good time to prune logs.
# This application will only prune logs if the confidence is higher than 50%. 
# This application checks every 5 seconds to see if we should prune the logs, however 
# in a real server monitoring application this period would likely be longer.

Write-Host "Server Ops v0.1!"
Write-Host
Write-Host "Ctrl-C to stop running"
Write-Host

function Get-Recommendation {
  try {
    $response = Invoke-WebRequest -URI http://localhost:8000/api/v0.1/pods/serverops/recommendation
  }
  catch {
    Write-Host "Unable to communicate with Spice.ai, is it running?"
    return
  }

  $recommendation = $response | ConvertFrom-Json

  Write-Host "Recommendation to $($recommendation.action) with confidence $($recommendation.confidence)"

  return $recommendation
}

function Invoke-TryPerformMaintenance {
  param (
    $Recommendation
  )

  if (!$Recommendation.confidence) {
    Write-Host "Recommendation has a confidence of 0. Has this pod been trained yet?"
    return
  }

  if ($Recommendation.confidence -gt 0.5 -and $Recommendation.action -eq "perform_maintenance") {
    Write-Host "Performing server maintenance now!"
  } else if ($Recommendation.confidence -gt 0.5 -and $Recommendation.action -eq "preload_cache") {
    Write-Host "Preloading cache now!"
  }
  else {
    Write-Host "Not performing any server operations"
  }
}

while ($true) {
  Write-Host "Checking for a server operation recommendation"

  $recommendation = Get-Recommendation
  if (!$recommendation) {
    return
  }

  Invoke-TryPerformMaintenance -Recommendation $recommendation
  Write-Host

  Start-Sleep -Seconds 5
}
