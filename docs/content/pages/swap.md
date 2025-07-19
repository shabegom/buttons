---
title: Swap Buttons
permalink: /usage/types/swap.html
eleventyNavigation:
  order: 9
  key: swap
  parent: types
  title: "Swap Buttons"
---

**Swap Buttons** are a special type of [Inline Button](/usage/inline) that cycles through multiple other buttons with each click. They're perfect for creating toggles, multi-state controls, and workflows where you need to perform different actions in sequence.

## How Swap Buttons Work

A Swap Button references multiple other buttons by their IDs. Each time you click the swap button, it executes the next button in the sequence, cycling back to the first after reaching the last.

## Creating Swap Buttons

### Step 1: Create the Action Buttons
First, create the individual buttons that the swap button will cycle through:

<pre>
```button
name Show Details
type append text
action ## Project Details
- Status: Active  
- Owner: John Doe
- Due Date: Next Friday
```
^button-show-details

```button
name Hide Details
type remove
action ## Project Details  
- Status: Active
- Owner: John Doe
- Due Date: Next Friday
```
^button-hide-details
</pre>

### Step 2: Create the Swap Button
Create a swap button that references the other buttons:

<pre>
```button
name Toggle Details
type swap
swap [show-details, hide-details]
```
^button-toggle-details
</pre>

### Step 3: Use as Inline Button
Swap buttons can only be used as [inline buttons](/usage/inline):

<pre>
Project info toggle: `button-toggle-details`
</pre>

## Swap Button Examples

### Simple Toggle
<pre>
```button
name Start Timer
type append text
action ⏱️ Timer started at <% tp.date.now("HH:mm") %>
templater true
```
^button-start-timer

```button
name Stop Timer  
type append text
action ⏹️ Timer stopped at <% tp.date.now("HH:mm") %>
templater true
```
^button-stop-timer

```button
name Timer Toggle
type swap
swap [start-timer, stop-timer]
```
^button-timer-toggle

Usage: `button-timer-toggle`
</pre>

### Multi-State Workflow
<pre>
```button
name Plan Project
type append text
action ## Status: Planning 📝
- [ ] Define requirements
- [ ] Create timeline
```
^button-plan

```button  
name Start Development
type append text
action ## Status: Development 💻
- [x] Planning complete
- [ ] Implementation
```
^button-develop

```button
name Deploy Project
type append text
action ## Status: Deployed 🚀
- [x] Development complete
- [ ] Monitoring
```
^button-deploy

```button
name Project Workflow
type swap
swap [plan, develop, deploy]
```
^button-project-workflow

Project status: `button-project-workflow`
</pre>

## Swap Button Features

### Cycle Behavior
- **Sequential**: Buttons execute in the order listed in the `swap` array
- **Circular**: After the last button, it cycles back to the first
- **Reset on note reload**: Swap position resets when you close and reopen the note

### Inline Only Restriction
Swap buttons can only be used as inline buttons:
- Must reference the swap button ID with `button-` prefix
- Cannot be clicked directly from the codeblock
- Work perfectly in [Live Preview](/usage) mode

## Creating Swap Buttons

**Using the [Button Maker](/maker):**
1. Select "Swap" as the button type
2. Add the button IDs you want to cycle through
3. Insert as an inline button

**Writing by hand:**
- Use the `swap [id1, id2, id3]` syntax
- Ensure all referenced buttons exist and have unique IDs
- Use as inline buttons only

Swap buttons provide an elegant way to create interactive, stateful elements in your notes, enabling sophisticated workflows while maintaining a clean, uncluttered interface.
