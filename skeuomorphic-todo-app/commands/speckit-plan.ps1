# /speckit.plan - Technical Implementation Plan
# This script is called by OpenCode when user types /speckit.plan

param(
    [string]$RequirementsText,
    [string]$TechStack = "Vanilla HTML/CSS/JavaScript"
)

Write-Host "🔧 Creating technical implementation plan..."
Write-Host ""
Write-Host "Based on requirements and tech stack: $TechStack"
Write-Host ""
Write-Host "I'll generate:"
Write-Host "- Architecture overview with component breakdown"
Write-Host "- Data models (JSON schemas)"
Write-Host "- File structure layout"
Write-Host "- Technical decision justifications"
Write-Host "- Implementation phases"
Write-Host ""
Write-Host "Ready to create the plan?"
