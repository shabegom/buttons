---
title: Command Buttons
permalink: /usage/types/command.html
eleventyNavigation:
  order: 5
  key: command
  parent: types
  title: "Command Buttons"
---

A command button will run the specified Command Palette command when clicked. The `action` argument for a command button is the name of the command you want to run:

<pre>
```button
name Toggle Pin Button
type command
action Toggle Pin
```
^button-toggle
</pre>

<pre>
```button
name New Excalidraw
type command
action Excalidraw: Create a new drawing - IN A NEW PANE
```
^button-drawing
</pre>

<pre>
```button
name Bounce
type command
action Hover Editor: Toggle bouncing popovers
```
^button-bounce
</pre>
