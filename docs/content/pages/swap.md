---
title: Swap Buttons
permalink: /usage/types/swap.html
eleventyNavigation:
  order: 9
  key: swap
  parent: types
  title: "Swap Buttons"
---

**Swap Buttons** are special [Inline Buttons](/usage/inline) that cycle through multiple other buttons with each click. They're perfect for creating toggles, multi-state controls, and workflows where you need to perform different actions in sequence.

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

### Mode Switcher
<pre>
```button
name Development Mode
type line(1) text
action Environment: Development 🔧
replace [1,1]
```
^button-dev-mode

```button
name Testing Mode
type line(1) text  
action Environment: Testing 🧪
replace [1,1]
```
^button-test-mode

```button
name Production Mode
type line(1) text
action Environment: Production 🏭
replace [1,1]
```
^button-prod-mode

```button
name Environment Switcher
type swap
swap [dev-mode, test-mode, prod-mode]
```
^button-env-switch

Environment: Unknown

Switch mode: `button-env-switch`
</pre>

## Advanced Swap Examples

### Task State Manager
<pre>
```button
name Mark Todo
type line(2) text
action - [ ] Complete the report
replace [2,2]
```
^button-todo

```button
name Mark In Progress
type line(2) text
action - [/] Complete the report (in progress)
replace [2,2]  
```
^button-progress

```button
name Mark Complete
type line(2) text
action - [x] Complete the report ✅
replace [2,2]
```
^button-complete

```button
name Task State Toggle
type swap
swap [todo, progress, complete]
```
^button-task-toggle

## Task List
- [ ] Complete the report

Toggle task state: `button-task-toggle`
</pre>

### Daily Mood Tracker
<pre>
```button
name Good Mood
type line(3) text
action Mood: 😊 Good
replace [3,3]
```
^button-good

```button
name Neutral Mood
type line(3) text
action Mood: 😐 Neutral  
replace [3,3]
```
^button-neutral

```button
name Bad Mood
type line(3) text
action Mood: 😞 Bad
replace [3,3]
```
^button-bad

```button
name Mood Tracker
type swap
swap [good, neutral, bad]
```
^button-mood-tracker

## Daily Check-in
Date: <% tp.date.now("YYYY-MM-DD") %>
Mood: Not set

Update mood: `button-mood-tracker`
</pre>

## Swap Button Features

### Cycle Behavior
- **Sequential**: Buttons execute in the order listed in the `swap` array
- **Circular**: After the last button, it cycles back to the first
- **Reset on note reload**: Swap position resets when you close and reopen the note

### State Independence
Each button in the swap sequence is independent:
- Different button types (command, text, template, etc.)
- Different styling and colors
- Different [mutations](/usage/mutations) (remove, replace)
- Different [Templater](/usage/templater) settings

### Inline Only Restriction
Swap buttons can only be used as inline buttons:
- Must reference the swap button ID with `button-` prefix
- Cannot be clicked directly from the codeblock
- Work perfectly in [Live Preview](/usage) mode

## Swap Button Best Practices

### Design Considerations
- **Clear state indication**: Make it obvious which state is currently active
- **Logical progression**: Order buttons in a natural sequence
- **Visual consistency**: Use similar styling for related swap buttons

### State Management
- **Predictable behavior**: Users should understand what the next click will do
- **Reset strategies**: Consider how state resets affect user experience
- **Documentation**: Label swap buttons clearly to indicate their purpose

### Common Patterns
- **Toggle**: Two-state on/off switches
- **Cycle**: Multi-state progression (todo → in progress → complete)
- **Mode switching**: Different operational modes
- **View states**: Show/hide different information

## Creating Complex Workflows

### Multi-Feature Dashboard
<pre>
```button
name Show Overview
type prepend template
action Overview Template
replace [3,10]
```
^button-overview

```button
name Show Details  
type prepend template
action Details Template
replace [3,10]
```
^button-details

```button
name Show Analytics
type prepend template
action Analytics Template
replace [3,10]
```
^button-analytics

```button
name Dashboard View
type swap
swap [overview, details, analytics]
```
^button-dashboard

# Project Dashboard
Current View: Default

Content will appear here...

Switch view: `button-dashboard`
</pre>

### Seasonal Planning
<pre>
```button
name Spring Plans
type append text
action ## Spring Planning 🌸
- [ ] Garden preparation
- [ ] Spring cleaning
```
^button-spring

```button  
name Summer Plans
type append text
action ## Summer Planning ☀️
- [ ] Vacation planning
- [ ] Outdoor activities
```
^button-summer

```button
name Fall Plans
type append text
action ## Fall Planning 🍂
- [ ] Harvest season
- [ ] Holiday preparation  
```
^button-fall

```button
name Winter Plans
type append text
action ## Winter Planning ❄️
- [ ] Holiday celebrations
- [ ] Indoor projects
```
^button-winter

```button
name Seasonal Planner
type swap
swap [spring, summer, fall, winter]
```
^button-seasonal

Plan for the season: `button-seasonal`
</pre>

## Troubleshooting Swap Buttons

**Swap button not working**: Ensure you're using it as an inline button with the `button-` prefix.

**Wrong button executing**: Check that the button IDs in the swap array match the actual button codeblock IDs.

**Swap resets unexpectedly**: This is normal behavior - swap position resets when you close and reopen the note.

**Button not cycling**: Verify all referenced buttons exist and have valid button IDs.

Swap buttons provide an elegant way to create interactive, stateful elements in your notes, enabling sophisticated workflows while maintaining a clean, uncluttered interface.
