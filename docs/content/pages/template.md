---
title: Template Buttons
permalink: /usage/template.html
eleventyNavigation:
  order: 7
  key: template
  parent: types
  title: "Template Buttons"
---

Template Buttons are the most powerful button type of all. They allow you to run templater templates when the button is clicked. These templates could add content to the active note, create a new note, or run any advanced Templater command. For example, if I had a template note called _Current Time_ and inside that note there was a templater command: `<% tp.date.now(HH:mm) %>` I could create the following Template Button to append the current time:

<pre>
```button
name Append Time
type append template
action Current Time
```
</pre>

the `template` type works a little differently from `command` and `link`. It has additional syntax to specify how you would like the template applied:

## Append/Prepend

`type append template` will add the template note specified in the `action` directly below the button (below the Button ID with a space). This is also a great type to use if your template performs an action, but doesn't actually add any content to the note.

<pre>
```button
name Append Time
type append template
action Current Time
```
</pre>

`type prepend template` will add the template note specified in the `action` directly above the botton.

<pre>
```button
name Prepend Time
type prepend template
action Current Time
```
</pre>

## Line

`type line(start, end)` will insert a template note at the specified start/end lines of the active note. 

<pre>
```button
name Time on Line 1
type line(1) template
action Current Time
```
</pre>

## Note

`type note(title, open)` will create a new note with the provided `title` and, optionally, `open` the created note.

`title` should be unique and follow the title specifications of Obsidian notes. To have a button that generates unique titles on every click, [check out using Templater inside a button codeblock](/templater)

There are a variety of options for `open`:
- `vsplit`: open in a vertical split
- `hsplit`: open in a horizontal split
- `tab`: open in a new tab
- `same`: open in the same window replacing the currently active note
- `window`: open in a new window
- `false`: don't open the newly created note

Create a note titled _Time Note_ and open it in a new tab:
<pre>
```button
name Note the Time
type note(Time Note, tab) template
action Current Time
```
</pre>

Create a note with today's date as the title and open it in the same window:
<pre>
```button
name Date Note with the Time
type note(<% tp.date.now() %>, same) template
action Current Time
templater true
```
</pre>

## Template Buttons + Mutations

Template Buttons can become even more powerful if combined with the [Replace Mutation](/usage/mutations/replace). With this combo you can remove a section from a note and then use a `type line(start, end)` to add content at that same location.


<pre>
```button
name Current Weather
type line(10, 15) template
action Current Weather
replace [10,15]
```
</pre>
