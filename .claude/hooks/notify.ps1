# Notification: Windows balloon so you notice when Claude is waiting for input.
# Launched detached by settings.json so the hook returns immediately.
Add-Type -AssemblyName System.Windows.Forms
$n = New-Object System.Windows.Forms.NotifyIcon
$n.Icon = [System.Drawing.SystemIcons]::Information
$n.BalloonTipTitle = 'Claude Code'
$n.BalloonTipText = 'portfolio_website: Claude needs you'
$n.Visible = $true
$n.ShowBalloonTip(5000)
Start-Sleep -Seconds 6
$n.Dispose()
