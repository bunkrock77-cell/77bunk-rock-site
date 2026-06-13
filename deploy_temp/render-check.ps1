$headers = @{Authorization = 'Bearer rnd_bJqbrxGoU8u2KwGzmPlFLKn6mzIo'}
try {
    $resp = Invoke-WebRequest -Uri 'https://api.render.com/v1/services' -Headers $headers -Method Get -UseBasicParsing
    $status = $resp.StatusCode
    $body = $resp.Content
} catch {
    $status = $_.Exception.Response.StatusCode.Value__
    $body = $_.Exception.Response.StatusDescription
}
"Status: $status" | Out-File -FilePath deploy_temp\render-check-output.txt -Encoding utf8
$body | Out-File -FilePath deploy_temp\render-check-output.txt -Append -Encoding utf8
