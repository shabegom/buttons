# Test Multi-line Text Buttons

This file tests multi-line support in text buttons to ensure the implementation works correctly and maintains backward compatibility.

## Current Single-line Examples (should work exactly as before)

```button
name Simple Single Line
type append text
action ## Single Line Header
```
^button-single-line

```button
name Simple Command (backward compatibility)
type command
action Toggle Pin
```
^button-simple-command

```button
name Simple Link (backward compatibility)
type link
action https://obsidian.md
```
^button-simple-link

## Multi-line Examples (new functionality)

### Multi-line Append Text

```button
name Multi-line Append
type append text
action ## Meeting Notes
- Topic 1
- Topic 2

## Action Items
- [ ] Task 1
- [ ] Task 2
```
^button-multi-append

### Multi-line Prepend Text

```button
name Meeting Template
type prepend text
action # Meeting - Date

**Attendees:** 
**Date:** 
**Time:** 

## Agenda

## Discussion

## Action Items
```
^button-meeting-template

### Code Block Example

```button
name Code Block Example
type append text
action ```javascript
// Your code here
function example() {
  console.log("Hello World");
}
```
```
^button-code-block

### Section Divider with Empty Lines

```button
name Section Divider
type append text
action 

---

## New Section

```
^button-section-divider

### Multi-line Copy Button

```button
name Copy Multi-line Email
type copy
action Hello,

I hope this message finds you well. 

Thank you for your message...

Best regards,
[Your Name]
```
^button-copy-email

## Line Insertion Tests

Line 1: This is line 1
Line 2: This is line 2
Line 3: This is line 3

```button
name Insert Multi-line at Line 2
type line(2) text
action **INSERTED CONTENT:**
- Item A
- Item B
- Item C
```
^button-line-insert

## Create New Note Tests

```button
name Daily Note Multi-line
type note(Test Daily Note) text
action # Daily Note - Today

## Today's Goals
- Goal 1
- Goal 2

## Notes

## Reflection
```
^button-daily-multiline

```button
name Project Template Note
type note(Test Project, split) text
action # Project Name

## Overview
Brief description of the project.

## Goals
- Primary goal
- Secondary goal

## Next Steps
- [ ] Step 1
- [ ] Step 2
```
^button-project-split

## Test with Other Arguments

### Multi-line with Color

```button
name Colorful Multi-line
type append text
action ## Important Notice
This is a multi-line text
with color styling.
color red
```
^button-color-multiline

### Multi-line with Custom Class

```button
name Styled Multi-line
type append text
action ## Custom Styled Content
- Point 1
- Point 2
class custom-button
```
^button-class-multiline

### Multi-line with Remove

```button
name One-time Multi-line Setup
type append text
action ## Setup Complete
Configuration has been applied:
- Setting A: Enabled
- Setting B: Configured
remove true
```
^button-remove-multiline

## Edge Cases

### Empty Lines in Content

```button
name Content with Empty Lines
type append text
action ## Header


Content with empty lines above and below.


More content here.
```
^button-empty-lines

### Special Characters

```button
name Special Characters
type append text
action ## Special Characters Test
- Emoji: 🎯 ✅ 📝
- Symbols: → ← ↑ ↓
- Unicode: ★ ❤ ➡
```
^button-special-chars

### Indented Content

```button
name Indented Content
type append text
action ## Indented List
    - Indented item 1
        - Sub-item A
        - Sub-item B
    - Indented item 2
```
^button-indented

## Backward Compatibility Verification

These should work exactly as they did before:

```button
name Original Single Line Text
type append text
action Single line of text
```
^button-original-single

```button
name Original Copy
type copy
action Simple text to copy
```
^button-original-copy

```button
name Original Command
type command
action Toggle pin
```
^button-original-command

## Test Results Section

Use the buttons above to test the functionality. Expected behavior:
- Single-line buttons should work exactly as before
- Multi-line buttons should insert content with proper line breaks
- Code blocks should preserve formatting
- Empty lines should be maintained
- Indentation should be preserved 