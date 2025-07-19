---
title: Templater + Buttons
permalink: /usage/templater.html
eleventyNavigation:
  order: 5
  key: templater
  parent: usage
  title: "Templater"
---

**Templater integration** allows you to include dynamic Templater commands within your buttons. When a button with `templater true` is clicked, the Templater commands are processed and converted to their values, then converted back for future use.

## Basic Templater Integration

Add `templater true` to any button to enable Templater command processing:

<pre>
```button
name Add Current Time
type append text
action Current time: <% tp.date.now("HH:mm:ss") %>
templater true
```
^button-current-time
</pre>

When clicked, this button will:
1. Process `<% tp.date.now("HH:mm:ss") %>` to get the current time (e.g., "14:30:15")
2. Append "Current time: 14:30:15" to your note
3. Convert back to the Templater command for the next use

## Dynamic Note Creation

### Time-based Note Titles
<pre>
```button
name Hourly Log
type note(<% tp.date.now("HH:MM") %> Log) text
action ## Log Entry - <% tp.date.now("YYYY-MM-DD HH:mm") %>

### Notes

templater true
```
^button-hourly-log
</pre>

### Daily Note Creation
<pre>
```button
name Create Daily Note
type note(<% tp.date.now("YYYY-MM-DD") %> Daily) template
action Daily Note Template
templater true
```
^button-daily-note
</pre>

## Text Insertion with Templater

### Dynamic Text Append
<pre>
```button
name Log Meeting
type append text
action 
---
**Meeting Log - <% tp.date.now("YYYY-MM-DD HH:mm") %>**

Attendees: 
Topics discussed:
Action items:

templater true
```
^button-meeting-log
</pre>

### Line Replacement with Time
<pre>
```button
name Update Status Line
type line(1) text
action Status: Updated on <% tp.date.now("YYYY-MM-DD") %>
replace [1,1]
templater true
```
^button-update-status
</pre>

## Template Buttons with Templater

### Dynamic Template Selection
<pre>
```button
name Weekly Review  
type note(Weekly Review - <% tp.date.now("YYYY-[W]WW") %>) template
action Weekly Review Template
templater true
```
^button-weekly-review
</pre>

## Advanced Templater Examples

### Context-Aware Buttons
<pre>
```button
name Reference Current File
type append text
action Referenced from: [[<% tp.file.title %>]] on <% tp.date.now("YYYY-MM-DD") %>
templater true
```
^button-reference
</pre>

### Conditional Content
<pre>
```button
name Weekday Log
type append text
action ## <% tp.date.now("dddd") %> Log - <% tp.date.now("YYYY-MM-DD") %>

<%* if (tp.date.now("dddd") === "Monday") { %>
### Weekly Goals
- [ ] Goal 1
- [ ] Goal 2
<%* } %>

### Today's Tasks

templater true
```
^button-weekday-log
</pre>

## Chain Buttons with Templater

Chain buttons fully support Templater integration:

<pre>
```button
name Daily Workflow
type chain
templater true
actions [
  {"type": "note(<% tp.date.now('YYYY-MM-DD') %> Daily, split) template", "action": "Daily Template"},
  {"type": "append text", "action": "Created: <% tp.date.now('HH:mm') %>"},
  {"type": "command", "action": "Focus on pane to the right"}
]
```
^button-daily-workflow
</pre>

## Templater Command Examples

### Date and Time Functions
- `<% tp.date.now() %>` - Current date/time
- `<% tp.date.now("YYYY-MM-DD") %>` - Formatted date
- `<% tp.date.now("HH:mm") %>` - Current time
- `<% tp.date.now("dddd") %>` - Day of week
- `<% tp.date.tomorrow("YYYY-MM-DD") %>` - Tomorrow's date
- `<% tp.date.yesterday("YYYY-MM-DD") %>` - Yesterday's date

### File Functions
- `<% tp.file.title %>` - Current file name
- `<% tp.file.folder() %>` - Current folder path
- `<% tp.file.path() %>` - Full file path
- `<% tp.file.size %>` - File size

### System Functions
- `<% tp.date.weekday("YYYY-MM-DD", 0) %>` - Next Monday
- `<% tp.system.prompt("Enter name") %>` - User input prompt
- `<% tp.system.clipboard %>` - Clipboard contents

## How Templater Buttons Work

1. **Before Click**: Button contains Templater commands
   ```
   action: Meeting - <% tp.date.now("YYYY-MM-DD") %>
   ```

2. **During Click**: Commands are processed
   ```
   action: Meeting - 2024-07-19
   ```

3. **After Click**: Commands are restored for next use
   ```
   action: Meeting - <% tp.date.now("YYYY-MM-DD") %>
   ```

This means each click processes fresh dynamic content while preserving the template for future use.

## Templater Requirements

To use Templater with buttons:
1. Install the Templater plugin
2. Enable Templater in Community Plugins
3. Configure your templates folder in Templater settings
4. Add `templater true` to your button configuration

Templater integration makes buttons incredibly powerful for creating dynamic, context-aware workflows that adapt to your current environment and needs.
