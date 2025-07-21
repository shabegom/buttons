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

### Insert Text at Cursor Position
Insert text at your current cursor position:

<pre>
```button
name Add Status Update
type cursor text
action **Status:** In Progress 📋
```
^button-cursor-status
</pre>

<pre>
```button
name Insert Timestamp
type cursor text
action Updated: 2024-01-15 14:30
```
^button-cursor-timestamp
</pre>

**Benefits of cursor insertion:**
- Text appears exactly where you're working
- No need to scroll or navigate after insertion
- Perfect for inline editing and quick additions
- Works naturally with your editing workflow

### Insert Text at Specific or Relative Line
Insert text at a specific line number, or relative to the button's position:

#### Absolute Line Positioning
<pre>
```button
name Add Status at Line 1
type line(1) text
action Status: In Progress
```
^button-line-status
</pre>

#### Relative Line Positioning
Insert text relative to the button's position using `+N` (after) or `-N` (before):

<pre>
```button
name Add Status After Button
type line(+1) text
action Status: In Progress
```
^button-relative-after
</pre>

<pre>
```button
name Add Priority Before Button
type line(-2) text
action 🔥 HIGH PRIORITY: Review needed
```
^button-relative-before
</pre>

**Benefits of relative positioning:**
- Buttons work regardless of their position in the file
- Templates remain portable when moved around
- Perfect for maintaining relative content structure

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

### New Note Opening Options
When creating new notes with `type note(title, open)`, you can specify how to open the note:

- `vsplit`: open in a vertical split
- `hsplit`: open in a horizontal split  
- `tab`: open in a new tab
- `same`: open in the same window replacing the currently active note
- `false`: don't open the newly created note

### Replace Content in Lines
Use text buttons with the `replace` argument to replace existing content using absolute or relative line numbers:

#### Absolute Line Replacement
<pre>
Status: Unknown
Progress: 0%

```button
name Update Status (Absolute)
type line(1) text
action Status: In Progress
Progress: 25%
replace [1,2]
```
^button-update-status-absolute
</pre>

#### Relative Line Replacement
Use `[+N,+M]` or `[-N,-M]` to replace lines relative to the button:

<pre>
Status: Unknown
Progress: 0%

```button
name Update Status (Relative)
type line(+1) text
action Status: In Progress
Progress: 25%
replace [+1,+2]
```
^button-update-status-relative
</pre>

This approach is perfect for portable templates that need to work regardless of where they're placed in a document.

### Dynamic Note Creation with Templater
Create notes with dynamic titles using Templater:

<pre>
```button
name Daily Note with Date
type note(<% tp.date.now("YYYY-MM-DD") %> Daily) text
action # Daily Note - <% tp.date.now("YYYY-MM-DD") %>

## Today's Goals

## Notes

templater true
```
^button-daily-note
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
3. **Absolute positioning**: Use `line(number)` for precise placement at specific lines
4. **Relative positioning**: Use `line(+N)` or `line(-N)` for portable templates that work regardless of button position
5. **Content replacement**: Use `replace [start,end]` for absolute line replacement or `replace [+start,+end]` for relative replacement
6. **Combining relative features**: Mix relative line insertion with relative replacement for fully portable button templates

Text Buttons are perfect for quickly inserting frequently used text patterns, creating structured notes, and building reusable content snippets. They're especially powerful when combined with Templater for dynamic, context-aware text insertion.