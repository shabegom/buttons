---
title: Remove Mutation
permalink: /usage/mutations/remove.html
eleventyNavigation:
  order: 9
  key: remove
  parent: mutations
  title: "Remove Mutations"
---

**Remove mutations** let you automatically remove buttons after they're clicked. This is perfect for one-time actions, cleanup tasks, or workflows where buttons should disappear once their purpose is complete.

## Basic Remove Functionality

### Remove Self After Click
Add `remove true` to make a button remove itself after clicking:

<pre>
```button
name One-Time Setup
type append text
action ## Project Setup Complete ✅
remove true
```
^button-one-time
</pre>

After clicking, this button will append the text and then disappear from the note.

## Removing Multiple Buttons

### Remove Specific Buttons by ID
Use an array of button IDs to remove multiple buttons:

<pre>
```button
name Start Project
type append text
action ## Project Started!
remove [setup, config, init]
```
^button-start-project
</pre>

This removes buttons with IDs `setup`, `config`, and `init` when clicked.

### Remove Self and Others
Combine `true` with button IDs to remove the clicked button plus others:

<pre>
```button
name Finalize Document
type append text
action ## Document Finalized
remove [true, draft, review, edit]
```
^button-finalize
</pre>

## Practical Remove Examples

### Daily Note Workflow
Create temporary buttons that disappear after setting up your daily note:

<pre>
```button
name Morning Setup
type prepend template
action Morning Template
remove true
```
^button-morning-setup
</pre>

<pre>
```button
name Add Tasks
type append text
action ## Today's Tasks
- [ ] Review emails
- [ ] Team meeting
- [ ] Project work
remove [morning-setup, evening-setup]
```
^button-add-tasks
</pre>

<pre>
```button
name Evening Setup
type append template
action Evening Template
remove true
```
^button-evening-setup
</pre>

### Weekly Planning Cleanup
Remove planning buttons after making decisions:

<pre>
```button
name Monday Focus
type prepend template
action Monday Template
remove [mon, tue, wed, thu, fri, planning]
```
^button-mon
</pre>

<pre>
```button
name Tuesday Focus
type prepend template
action Tuesday Template
remove [mon, tue, wed, thu, fri, planning]
```
^button-tue
</pre>

<pre>
```button
name Cancel Planning
type remove
remove [mon, tue, wed, thu, fri]
```
^button-planning
</pre>

## Remove with Different Button Types

### Command Buttons
<pre>
```button
name Open Settings (One Time)
type command
action Open settings
remove true
```
^button-settings-once
</pre>

### Link Buttons
<pre>
```button
name Visit Documentation
type link
action https://help.obsidian.md
remove true
```
^button-docs-once
</pre>

### Chain Buttons with Remove
<pre>
```button
name Complete Workflow
type chain
remove true
actions [
  {"type": "append text", "action": "## Workflow Complete"},
  {"type": "command", "action": "Move file to another folder"},
  {"type": "remove", "action": "[task1, task2, task3]"}
]
```
^button-complete-workflow
</pre>

## Remove with [Inline Buttons](/usage/inline)

Remove functionality works with inline buttons too:

<pre>
Daily actions: `button-morning` `button-afternoon` `button-evening`

```button
name Morning Routine
type append text
action ## Morning Complete
remove [morning, afternoon, evening]
```
^button-morning

```button
name Afternoon Work
type append text  
action ## Afternoon Complete
remove [afternoon, evening]
```
^button-afternoon

```button
name Evening Wrap-up
type append text
action ## Day Complete
remove true
```
^button-evening
</pre>

## Remove Best Practices

### Planning Removal Strategy
- **Self-removing buttons**: Use for one-time actions
- **Group removal**: Use for mutually exclusive choices
- **Progressive removal**: Use for step-by-step workflows
- **Cleanup buttons**: Use to clear completed buttons

### Button ID Management
- Use descriptive IDs for buttons you'll reference
- Group related buttons with similar ID prefixes
- Keep a mental map of which buttons remove which

Remove mutations are powerful for creating clean, progressive workflows where buttons serve their purpose and then get out of the way, keeping your notes uncluttered and focused on current actions.
