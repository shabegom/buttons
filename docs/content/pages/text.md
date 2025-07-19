---
title: Text Buttons
date: 2024-07-19T00:00:00.000Z
permalink: usage/types/text.html
eleventyNavigation:
  order: 5
  key: text
  parent: types
  title: Text
---

**Text Buttons** let you quickly insert, prepend, append, or create new notes with specified text content. Unlike [Template Buttons](/usage/types/template) which use template files, Text Buttons work directly with the text you specify in the button.

## Text Button Types

### Append Text
Add text to the end of your current note:

<pre>
```button
name Add Meeting Notes Section
type append text
action ## Meeting Notes
```
^button-append-meeting
</pre>

### Prepend Text  
Add text to the beginning of your current note:

<pre>
```button
name Add Priority Flag
type prepend text
action 🔥 HIGH PRIORITY
```
^button-prepend-priority
</pre>

### Insert Text at Specific Line
Insert text at a specific line number:

<pre>
```button
name Add Status at Top
type line(1) text
action Status: In Progress
```
^button-line-status
</pre>

### Create New Note with Text
Create a new note containing your specified text:

<pre>
```button
name Quick Meeting Note
type note(Quick Meeting) text
action ## Agenda
- Topic 1
- Topic 2

## Action Items
- [ ] Task 1
- [ ] Task 2
```
^button-new-meeting
</pre>

## Advanced Text Button Options

### New Note with Split Pane
Create a new note and open it in a split pane:

<pre>
```button
name Project Notes (Split)
type note(New Project, split) text  
action # Project Name

## Overview

## Goals

## Next Steps
```
^button-project-split
</pre>

### New Note in New Tab
Create a new note and open it in a new tab:

<pre>
```button
name Daily Journal (Tab)
type note(Journal Entry, tab) text
action # Daily Journal - Date

## Wins

## Challenges  

## Tomorrow's Focus
```
^button-journal-tab
</pre>

### Replace Content in Lines
Use text buttons with the `replace` argument to replace existing content:

<pre>
Status: Unknown
Progress: 0%

```button
name Update Status
type line(1) text
action Status: Completed
replace [1,2]
```
^button-update-status
</pre>

## Using Text Buttons with [Templater](/usage/templater)

Combine Text Buttons with Templater for dynamic content:

<pre>
```button
name Add Timestamp
type append text
action ## <% tp.date.now("YYYY-MM-DD HH:mm") %>
templater true
```
^button-timestamp
</pre>

### Dynamic New Note Creation
<pre>
```button
name Daily Note
type note(<% tp.date.now("YYYY-MM-DD") %> Daily) text
action # Daily Note - <% tp.date.now("dddd, MMMM Do YYYY") %>

## Today's Goals
- 

## Notes

## Reflection
templater true
```
^button-daily-dynamic
</pre>

## Practical Text Button Examples

### Quick Log Entry
<pre>
```button
name Log Entry
type append text
action 
---
**<% tp.date.now("HH:mm") %>** - 
templater true
```
^button-log
</pre>

### Add Section Divider
<pre>
```button
name Section Break
type append text
action 

---

## New Section

```
^button-divider
</pre>


### Task List Starter
<pre>
```button
name Add Task List
type append text
action ## Tasks
- [ ] Task 1
- [ ] Task 2  
- [ ] Task 3
```
^button-tasks
</pre>

### Meeting Template
<pre>
```button
name Meeting Setup
type prepend text
action # Meeting - <% tp.date.now("YYYY-MM-DD") %>

**Attendees:** 
**Date:** <% tp.date.now("MMMM Do, YYYY") %>
**Time:** <% tp.date.now("h:mm A") %>

## Agenda

## Discussion

## Action Items

templater true
```
^button-meeting-setup
</pre>

## Text Button Features

### Multi-line Text Support
Text Buttons support multi-line content. Each new line in your action becomes a new line in the inserted text.

### Markdown Formatting
All Markdown formatting is preserved:
- **Bold** and *italic* text
- Headers (##, ###, etc.)
- Lists (-, *, numbered)
- Links `[text](url)`
- Code blocks and inline code

### Special Characters
Text Buttons handle special characters correctly:
- Emoji: 🎯 ✅ 📝
- Symbols: → ← ↑ ↓
- Unicode characters

## Combining with [Button Mutations](/usage/mutations)

### Remove Button After Use
<pre>
```button
name One-Time Setup
type append text  
action ## Project Setup Complete
remove true
```
^button-one-time
</pre>

### Remove Multiple Buttons
<pre>
```button
name Finalize Document
type append text
action ## Document Finalized - <% tp.date.now() %>
remove [draft, review, edit]
templater true
```
^button-finalize
</pre>

## Tips for Text Buttons

1. **Line breaks**: Use actual line breaks in your action for multi-line text
2. **Templater integration**: Add `templater true` for dynamic content
3. **Positioning**: Use `line(number)` for precise placement
4. **New note options**: Choose between same tab, split, or new tab
5. **Content replacement**: Use `replace [start,end]` to update existing content

Text Buttons are perfect for quickly inserting frequently used text patterns, creating structured notes, and building reusable content snippets. They're especially powerful when combined with Templater for dynamic, context-aware text insertion.