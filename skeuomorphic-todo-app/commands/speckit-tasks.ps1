# /speckit.tasks - Task Generation
# This script is called by OpenCode when user types /speckit.tasks

param(
    [string]$PlanText
)

Write-Host "📋 Breaking down implementation plan into tasks..."
Write-Host ""
Write-Host "I'll generate numbered tasks with:"
Write-Host "- Clear descriptions"
Write-Host "- Complexity indicators (Simple/Medium/Hard)"
Write-Host "- Dependencies between tasks"
Write-Host "- Acceptance criteria for each task"
Write-Host "- Phased approach (Foundation → Core Features → Polish)"
Write-Host ""
Write-Host "Proceeding to generate task list..."
