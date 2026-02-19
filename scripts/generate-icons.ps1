Add-Type -AssemblyName System.Drawing

function New-RoundedRectPath {
    param([int]$Size, [int]$Radius)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $Radius * 2
    $path.AddArc(0, 0, $d, $d, 180, 90)
    $path.AddArc($Size - $d, 0, $d, $d, 270, 90)
    $path.AddArc($Size - $d, $Size - $d, $d, $d, 0, 90)
    $path.AddArc(0, $Size - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function New-AppIcon {
    param([int]$Size, [string]$OutputPath)

    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $bitmap.SetResolution(96, 96)
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    $g.Clear([System.Drawing.Color]::Transparent)

    $radius = [math]::Round($Size * 7.0 / 32.0)
    $path = New-RoundedRectPath -Size $Size -Radius $radius

    $blue = [System.Drawing.ColorTranslator]::FromHtml("#60a5fa")
    $teal = [System.Drawing.ColorTranslator]::FromHtml("#5eead4")
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($Size, $Size)),
        $blue,
        $teal
    )

    $g.FillPath($brush, $path)

    $fontSize = [math]::Round($Size * 0.55)
    $font = New-Object System.Drawing.Font("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center

    $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
    $g.DrawString("%", $font, $textBrush, $rect, $format)

    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $font.Dispose()
    $textBrush.Dispose()
    $format.Dispose()
    $brush.Dispose()
    $path.Dispose()
    $g.Dispose()
    $bitmap.Dispose()

    Write-Host "Created: $OutputPath ($Size x $Size)"
}

$iconsDir = Join-Path $PSScriptRoot "..\public\icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
}

New-AppIcon -Size 192 -OutputPath (Join-Path $iconsDir "icon-192x192.png")
New-AppIcon -Size 512 -OutputPath (Join-Path $iconsDir "icon-512x512.png")

Write-Host "`nDone! Icons generated in public/icons/"
