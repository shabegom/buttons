---
title: Using Buttons
date: 2022-10-16T17:10:38.320Z
permalink: usage.html
eleventyNavigation:
  order: 3
  key: usage
  title: Usage
---

To add a button to your note, you need to add a button codeblock. Let's break down the parts of a buttons piece-by-piece. If you'd prefer to learn by doing I suggest trying the [Button Maker](/maker).

## Codeblocks

A codeblock in Obsidian opens with three backticks and closes with three backticks.

<pre>
```
This is a codeblock
```
</pre>

You can provde the type of the codeblock after the first three backticks. Buttons codeblocks are of type `button`:

<pre>
```button
I am a button codeblock

```
</pre>

If you're using Live Preview, when the cursor moves out of a button codeblock it will render the button.

## Button Arguments

You specify what a button does by supplying arguments inside a codeblock. There are 3 required arguments:
- `name`: The text that will be displayed on the button when it is rendered.
- `type`: What the type of button it is (command, link, template, swap).
- `action`: Depending on the type chosen the action is what the button will actually do.

<pre>
```button
name This Is My Button
type command
action Toggle Pin
```
^button-toggle
</pre>

The button above will render: <button class="text-purple-500 border border-purple-500 hover:bg-purple-500 hover:text-white active:bg-purple-600 font-bold  rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 px-2"><strong>This is My Button</strong></button>. When it is clicked the _Toggle Pin_ command will run.

## Button ID

You might have noticed the `^button-toggle` directly below the codeblock. **This is required for Buttons to run**. All Button IDs must start with `button` and must be unique.

If you use the [Button Maker](/maker) an ID will be generated for you. As of Buttons 1.0, the Button ID is hidden unless the cursor is above or below the line it is on. Besides being necessary for the proper functioning of Buttons, IDs can also be used to reference a button once it has been defined. This way you can create a button once and then reuse that button throughout your vault.


To learn more about different usages of Buttons check these pages out:
- [Button Types](/usage/types)
- [Button Mutations](/usage/mutations)
- [Templater inside Buttons](/usage/templater)
- [Inline Buttons](/usage/inline)
- [Button Styling](/usage/styling)
