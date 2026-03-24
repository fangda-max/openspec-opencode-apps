# /speckit.specify - Requirements Specification
# This script is called by OpenCode when user types /speckit.specify

param(
    [string]$UserInput
)

Write-Host "📝 Transforming your idea into structured requirements..."
Write-Host ""
Write-Host "Your request: $UserInput"
Write-Host ""
Write-Host "I'll generate:"
Write-Host "- User stories in format: 'As a [user], I want to [action] so that [benefit]'"
Write-Host "- Acceptance criteria as bullet points"
Write-Host "- Non-functional requirements (performance, accessibility)"
Write-Host "- Edge cases and error scenarios"
Write-Host ""
Write-Host "Proceed with generating requirements?"
