# /speckit.implement - Task Execution
# This script is called by OpenCode when user types /speckit.implement

param(
    [string]$TaskList
)

Write-Host "🚀 Executing implementation tasks..."
Write-Host ""
Write-Host "I'll work through each task sequentially:"
Write-Host "1. Implement required functionality"
Write-Host "2. Test manually in browser"
Write-Host "3. Verify against acceptance criteria"
Write-Host "4. Move to next task only when complete"
Write-Host ""
Write-Host "Quality checks will include:"
Write-Host "- Code follows constitution standards"
Write-Host "- Design matches skeuomorphic principles"
Write-Host "- Browser compatibility verified"
Write-Host "- No console errors or warnings"
Write-Host ""
Write-Host "Proceeding with implementation..."
