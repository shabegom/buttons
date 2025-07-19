---
title: Buttons Loves you
date: Last Modified
permalink: /
eleventyNavigation:
  key: home
  order: 0
  title: Home
---

This is the documentation site for the amazing and super popular [Obsidian](https://obsidian.md) plugin [Buttons](https://github.com/shabegom/buttons).

With Buttons you can add codeblocks into your Obsidian notes that will render a clickable element (a button). Buttons can be used to [run any command that appears in the Command Palette](/usage/types/command), [open a link](/usage/types/link) (including deep links), and [run templater templates](/usage/types/template).

A button codeblock looks like this:

<pre>
```button
name My Super Button
type command
action Toggle Pin
```
^button-super
</pre>

And renders like this:
![](/content/images/button-example.png)

Clicking on that will run the command _Toggle Pin_.  

You can also render a button inline. Create the button codeblock and then reference it using the button block id: 
<pre>
`button-super`
</pre>

To get started quickly making buttons there is a [Button Maker](/maker) command that will walk you through button creation step-by-step.

There are also some advanced features like:
- [Button Mutations](/usage/mutations)
- [Templater inside Buttons](/usage/templater)
- [Inline Buttons](/usage/inline)
- [Chain Buttons](/usage/types/chain)

## Issues

If you face an issue using Buttons please head to the [OMG Discord](https://discord.com/invite/obsidianmd) and ping @shabegom in the #plugin-general channel. If Discord isn't your thing you could ask for help in the [Obsidian Forums](https://forum.obsidian.md/).

Please don't file issues on GitHub unless the problem is a bug in Buttons itself.
