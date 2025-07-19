---
title: Chain Buttons
date: 2024-07-19T00:00:00.000Z
permalink: usage/types/chain.html
eleventyNavigation:
  order: 7
  key: chain
  parent: types
  title: Chain
---

A **Chain Button** allows you to run multiple actions in sequence with a single click. Each action can be any supported button type (command, text, template, link, calculate, copy, or even another chain). This is perfect for creating complex workflows that automate multiple steps at once.

## Basic Chain Button

<pre>
```button
name Daily Setup
type chain
actions [
  {"type": "command", "action": "Periodic Notes: Open today's daily note"},
  {"type": "append text", "action": "## Tasks for Today"},
  {"type": "template", "action": "Daily Task Template"}
]
```
^button-daily-setup
</pre>

When clicked, this button will:
1. Open today's daily note
2. Append "## Tasks for Today" to the note  
3. Append your Daily Task Template

## Chain Button Syntax

The `actions` field must be a valid JSON array of objects. Each action object requires:
- **`type`**: The type of action to perform
- **`action`**: What the action should do (varies by type)

### Supported Action Types

**Command Actions:**
<pre>
{"type": "command", "action": "Toggle Pin"}
</pre>

**Text Actions:**
<pre>
{"type": "append text", "action": "## New Section"}
{"type": "prepend text", "action": "Priority: High"}
{"type": "line(1) text", "action": "Updated: Today"}
{"type": "note(Meeting Notes) text", "action": "Agenda items go here"}
</pre>

**Template Actions:**  
<pre>
{"type": "append template", "action": "Meeting Template"}
{"type": "prepend template", "action": "Header Template"}
{"type": "note(New Project) template", "action": "Project Template"}
</pre>

**Link Actions:**
<pre>
{"type": "link", "action": "https://obsidian.md"}
{"type": "link", "action": "obsidian://show-plugin?id=buttons"}
</pre>

**Calculate Actions:**
<pre>
{"type": "calculate", "action": "2+2"}
{"type": "calculate", "action": "$1+$2"}
</pre>

## Advanced Chain Examples

### Project Setup Chain
This chain creates a new project note and sets up the basic structure:

<pre>
```button
name New Project Setup
type chain
actions [
  {"type": "note(Project - Untitled, split) template", "action": "Project Template"},
  {"type": "append text", "action": "## Goals"},
  {"type": "append text", "action": "## Tasks"},
  {"type": "append text", "action": "## Resources"},
  {"type": "command", "action": "Focus on pane to the right"}
]
```
^button-project-setup
</pre>

### Weekly Review Chain
Automate your weekly review process:

<pre>
```button
name Weekly Review
type chain
actions [
  {"type": "command", "action": "Periodic Notes: Open this week's weekly note"},
  {"type": "append template", "action": "Weekly Review Template"},
  {"type": "command", "action": "Periodic Notes: Open next week's weekly note"},
  {"type": "append template", "action": "Weekly Planning Template"}
]
```
^button-weekly-review  
</pre>

### Research Note Chain
Create a research note with metadata and structure:

<pre>
```button
name Research Note
type chain  
actions [
  {"type": "note(Research - Topic, tab) template", "action": "Research Template"},
  {"type": "line(1) text", "action": "created:: [[<% tp.date.now() %>]]"},
  {"type": "append text", "action": "## Summary"},
  {"type": "append text", "action": "## Key Points"},
  {"type": "append text", "action": "## References"}
]
```
^button-research-note
</pre>

## Using Chain Buttons with [Templater](/usage/templater)

You can use Templater commands within chain button actions for dynamic content:

<pre>
```button
name Time-stamped Entry
type chain
templater true
actions [
  {"type": "append text", "action": "## <% tp.date.now('YYYY-MM-DD HH:mm') %>"},
  {"type": "append template", "action": "Daily Log Template"}
]
```
^button-timestamped
</pre>

## Tips for Chain Buttons

1. **Order matters**: Actions execute from top to bottom
2. **JSON formatting**: The actions array must be valid JSON
3. **Error handling**: If one action fails, the rest will still attempt to run
4. **Testing**: Start with simple chains and build complexity gradually
5. **Performance**: Very long chains might feel slow - consider breaking them up

## Creating Chain Buttons

**Using the [Button Maker](/maker):**
1. Select "Chain" as the button type
2. Add actions one by one, specifying type and action for each
3. The Button Maker will generate the proper JSON formatting

**Writing by hand:**
- Use a JSON validator if you run into formatting issues
- Each action object needs both `type` and `action` fields
- Remember to escape quotes inside action strings if needed

Chain buttons are incredibly powerful for automating complex workflows. Start simple and gradually build more sophisticated automation as you get comfortable with the syntax.