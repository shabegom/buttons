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

## Template Plugin Support

Template Buttons support both **Core Templates** (Obsidian's built-in plugin) and **Templater** (community plugin) simultaneously. You can use templates from both plugins in the same vault without conflicts.

### How It Works

- **Single Plugin**: If only one template plugin is enabled, buttons work exactly as before
- **Both Plugins**: When both are enabled, the system searches both template folders
- **Priority System**: If templates with the same name exist in both folders, Templater takes priority
- **Clear Feedback**: You'll see which plugin's template is being used

### Example Setup

If you have:
- Core Templates folder: `Templates/`
- Templater folder: `Templater/`

And both folders contain `meeting.md`, the button will use the Templater version and show a notice:

<pre>
```button
name Add Meeting Notes
type append template
action meeting
```
</pre>

**Notice shown**: "Found template 'meeting' in both Core Templates and Templater folders. Using Templater version."

### Benefits

- **Flexibility**: Use the best features of both plugins
- **Migration**: Gradually move templates between plugins
- **Organization**: Keep different types of templates in different systems
- **Compatibility**: All existing buttons continue to work

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

## Cursor

`type cursor template` will insert the template content at your current cursor position. This is perfect for inline editing and inserting content exactly where you're working:

<pre>
```button
name Insert Meeting Notes  
type cursor template
action Meeting Template
```
</pre>

<pre>
```button
name Add Task Block
type cursor template
action Task Template
```
</pre>

**Benefits of cursor insertion:**
- Template content appears exactly where you're working
- No need to scroll or navigate after insertion
- Perfect for inline editing workflows
- Works seamlessly with both Templater and core Templates

## Line

`type line(number)` will insert a template note at the specified line of the active note. You can use either **absolute** or **relative** line positioning:

### Absolute Line Positioning
Use `line(N)` to insert at a specific line number:

<pre>
```button
name Time on Line 1
type line(1) template
action Current Time
```
</pre>

### Relative Line Positioning
Use `line(+N)` to insert N lines **after** the button, or `line(-N)` to insert N lines **before** the button:

<pre>
```button
name Insert After Button
type line(+1) template
action Current Time
```
</pre>

<pre>
```button
name Insert Before Button  
type line(-2) template
action Current Time
```
</pre>

**Relative positioning benefits:**
- Buttons work regardless of their position in the file
- Templates remain portable when moved around
- Perfect for dynamic content that needs to stay relative to the button

### DataView Refresh Example
A common use case is refreshing DataView queries. This button will always refresh the query that appears after it:

<pre>
```button
name Refresh DataView
type line(+1) template
action dataview-refresh
replace [+1,+1]
```

```dataviewjs
// Your DataView query here
dv.list(dv.pages().file.name)
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

Template Buttons can become even more powerful if combined with the [Replace Mutation](/usage/mutations/replace). You can remove a section from a note and then use a `type line()` to add content at that location.

### Absolute Positioning with Replace
<pre>
```button
name Current Weather (Absolute)
type line(10) template
action Current Weather
replace [10,15]
```
</pre>

### Relative Positioning with Replace
Use relative positioning to make buttons work anywhere in your document:

<pre>
```button
name Current Weather (Relative)
type line(+1) template
action Current Weather
replace [+1,+3]
```
</pre>

This approach is especially useful for templates that need to be moved around, as the button will always operate relative to its current position rather than fixed line numbers.
