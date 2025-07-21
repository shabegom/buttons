---
title: Button Types
date: 2022-10-16T17:12:07.067Z
permalink: /usage/types.html
eleventyNavigation:
  order: 4
  key: types
  parent: usage
  title: "Button Types"
---

A Button Type is what you supply to the `type` argument inside your button codeblock. This defines what kind of action the button should take when it is clicked.

## Core Button Types

### [Command](/usage/types/command)
Run any command from Obsidian's Command Palette. Perfect for triggering plugin functions, core Obsidian features, or custom commands.

<pre>
```button
name Toggle Pin
type command
action Toggle pin
```
^button-example-command
</pre>

### [Link](/usage/types/link)
Open URLs, URIs, or Obsidian internal links. Great for quick access to websites, files, or other notes.

<pre>
```button
name Open Documentation
type link
action https://help.obsidian.md
```
^button-example-link
</pre>

### [Template](/usage/types/template)
Insert content from template files or create new notes from templates. Works with both Obsidian Templates and Templater. Supports cursor insertion for precise placement.

<pre>
```button
name Add Meeting Notes
type append template
action Meeting Template
```
^button-example-template
</pre>

## Content Button Types

### [Text](/usage/types/text)
Insert, append, prepend, or create notes with specified text content. No template files required. Also supports cursor insertion for inline editing.

<pre>
```button
name Add Task Section
type append text
action ## Tasks
- [ ] Task 1
- [ ] Task 2
```
^button-example-text
</pre>

### [Copy](/usage/types/copy)
Copy text to your clipboard for pasting elsewhere. Useful for frequently used snippets, commands, or templates.

<pre>
```button
name Copy Email Template
type copy
action Hello,

Thank you for your message...

Best regards,
[Your Name]
```
^button-example-copy
</pre>

### [Calculate](/usage/types/calculate)
Perform mathematical calculations and display results. Can reference numbers from other lines in your note.

<pre>
```button
name Calculate Total
type calculate
action 100+200+50
```
^button-example-calculate
</pre>

## Advanced Button Types

### [Chain](/usage/types/chain)
Execute multiple actions in sequence with a single button click. Combine different button types for complex workflows.

<pre>
```button
name Daily Setup
type chain
actions [
  {"type": "command", "action": "Open today's daily note"},
  {"type": "append text", "action": "## Today's Goals"},
  {"type": "template", "action": "Daily Template"}
]
```
^button-example-chain
</pre>

### [Swap](/usage/types/swap)
Create buttons that cycle through multiple actions. Only works as [Inline Buttons](/usage/inline) and perfect for toggles or multi-state controls.

<pre>
```button
name Toggle Timer
type swap
swap [start-timer, stop-timer]
```
^button-example-swap
</pre>

## Choosing the Right Button Type

**Use Command buttons when:**
- You want to trigger existing Obsidian or plugin functionality
- You need to run system commands or scripts
- You want to automate repetitive manual actions

**Use Link buttons when:**
- You need quick access to websites or external resources
- You want to open specific notes or attachments
- You're creating navigation or reference buttons

**Use Template buttons when:**
- You have pre-made template files you want to reuse
- You need dynamic content generation with Templater
- You want consistent formatting across multiple notes

**Use Text buttons when:**
- You need simple text insertion without creating template files
- You want to add structured content quickly
- You need basic dynamic text with [Templater integration](/usage/templater)

**Use Copy buttons when:**
- You frequently copy the same text snippets
- You need to transfer content between applications
- You want to build a clipboard library of useful text

**Use Calculate buttons when:**
- You need to perform math operations in your notes
- You want to reference and calculate with numbers from your content
- You're tracking numerical data that requires computation

**Use Chain buttons when:**
- You need to perform multiple actions in sequence
- You want to automate complex workflows
- You need to combine different button types in one click

**Use Swap buttons when:**
- You need toggle functionality (on/off, show/hide)
- You want to cycle through different states
- You need interactive controls within your content

Each button type can be enhanced with [mutations](/usage/mutations) for removing buttons, replacing content, and other advanced behaviors. You can also combine them with [Templater](/usage/templater) for dynamic, context-aware functionality.

