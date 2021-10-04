#!/usr/local/bin/pwsh

# This is a server ops application written in Powershell that queries Spice.ai
# for intelligent recommendations on when it would be a good time to perform 
# various server operations.
# This application will only take the recommendation if the confidence is higher than 50%. 
# As an example, this application checks every 5 seconds however in a real server monitoring
# application this period would likely be longer, such as every 5mins

Write-Host "Server Ops v0.1!"
Write-Host
Write-Host "Ctrl-C to stop running"
Write-Host

function Get-Recommendation {
  try {
    $response = Invoke-WebRequest -URI http://localhost:8000/api/v0.1/pods/serverops/recommendation
  }
  catch {
    if ($null -eq $_.Exception.Response) {
      Write-Warning "Unable to communicate with Spice.ai, is it running?"
    } else {
      $message = $_.ErrorDetails.Message | ConvertFrom-Json
      if ($message.response.result -eq "pod_not_initialized") {
        Write-Warning "Pod not initialized. Have you run spice add quickstarts/serverops yet?"
      } else {
        Write-Warning "The Spice.ai runtime returned an error: $($message.response.result)"
      }
    }
    return
  }

  $recommendation = $response | ConvertFrom-Json

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

  if ($Recommendation.confidence -gt 0.5) {
    Write-Host "Successfully got recommendation to '$($recommendation.action)' with confidence '$($recommendation.confidence)'" -ForegroundColor Green

    if ($Recommendation.action -eq "perform_maintenance") {
      Write-Host "Performing server maintenance now!"
    } elseif ($Recommendation.action -eq "preload_cache") {
      Write-Host "Preloading cache now!"
    }
  } else {
    Write-Host "Not performing any server operations"
  }
}

while ($true) {
  Write-Host "Checking for a server operation recommendation..."

  $recommendation = Get-Recommendation
  if (!$recommendation) {
    return
  }

  Invoke-TryPerformMaintenance -Recommendation $recommendation
  Write-Host

  Start-Sleep -Seconds 5
}
