$ErrorActionPreference = 'Stop'
Write-Output 'Ready for source credential JSON on stdin (input is hidden).'
$buffer = [System.Text.StringBuilder]::new()
while ($true) {
  $key = [Console]::ReadKey($true)
  if ($key.Key -eq [ConsoleKey]::Enter) { break }
  if ($key.KeyChar -ne [char]0) { [void]$buffer.Append($key.KeyChar) }
}
$credentialData = $buffer.ToString() | ConvertFrom-Json
$buffer.Clear() | Out-Null
$remote = [string]$credentialData.remote_url
$branch = [string]$credentialData.branch
$manifest = Get-Content -LiteralPath '.openai/hosting.json' -Raw | ConvertFrom-Json
if ($manifest.project_id -ne 'appgprj_6ad8b2d5161c8191b9b24b3a1b1f6ff9') { throw 'Unexpected project ID' }
if (-not $remote.StartsWith('https://git.chatgpt-team.site/') -or $branch -ne 'main') { throw 'Unexpected source destination' }
if ([DateTimeOffset]::Parse($credentialData.token_expires_at) -le [DateTimeOffset]::UtcNow) { throw 'Source credential expired' }
$env:SITES_GIT_AUTHORIZATION = 'Authorization: Bearer ' + $credentialData.token
$env:GIT_TERMINAL_PROMPT = '0'
$networkOptions = @('-c', 'http.sslBackend=openssl', '-c', 'http.proxy=', '-c', 'credential.helper=', '-c', 'http.extraHeader=', '-c', 'http.followRedirects=false', ('--config-env=http.' + $remote + '.extraHeader=SITES_GIT_AUTHORIZATION'))
try {
  if (-not (Test-Path -LiteralPath '.git')) {
    & git init --initial-branch main .
    if ($LASTEXITCODE -ne 0) { throw 'Could not initialize Site source' }
  }
  $remoteHead = & git @networkOptions ls-remote --heads $remote refs/heads/main
  if ($LASTEXITCODE -ne 0) { throw 'Could not read Site source destination' }
  if ($remoteHead) {
    $localHead = & git rev-parse --verify HEAD 2>$null
    if ($LASTEXITCODE -ne 0) { throw 'Remote source exists; preserve local files and reconcile before publishing' }
    $expectedHead = ($remoteHead -split '\s+')[0]
    if ($localHead -ne $expectedHead) { throw 'Remote source differs from local source; no history overwritten' }
  }
  & git add --all -- .
  if ($LASTEXITCODE -ne 0) { throw 'Could not stage source' }
  & git -c user.name=Sites -c user.email=sites@users.noreply.openai.com commit -m 'Refine VHU landing page with softer corners and publish'
  if ($LASTEXITCODE -ne 0) { throw 'Could not commit source' }
  $commitSha = (& git rev-parse HEAD).Trim()
  & git @networkOptions push $remote ($commitSha + ':refs/heads/main')
  if ($LASTEXITCODE -ne 0) { throw 'Could not push source; local commit retained' }
  $verified = & git @networkOptions ls-remote --heads $remote refs/heads/main
  if ($LASTEXITCODE -ne 0 -or ($verified -split '\s+')[0] -ne $commitSha) { throw 'Pushed source verification failed' }
  $dirty = & git status --porcelain
  if ($dirty) { throw 'Source changed during publication' }
  Write-Output (@{project_id=$manifest.project_id;commit_sha=$commitSha;checkout_path=(Get-Location).Path} | ConvertTo-Json -Compress)
} finally {
  Remove-Item Env:SITES_GIT_AUTHORIZATION -ErrorAction SilentlyContinue
  $credentialData = $null
}
