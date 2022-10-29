---
title: Buttons Loves you
date: Last Modified
permalink: /
eleventyNavigation:
  key: home
  order: 0
  title: Home
---

This is the documentation site for the amazing and super popular [Obsidian](https://obisidian.md) plugin [Buttons](https://github.com/shabegom/buttons).
Right now, it is pretty empty. Want to help fill it out? Contact shabegom in the OMG Discord.

With Buttons you can add codeblocks into your Obsidian notes that will render a clickable element (a button). Buttons can be used to [run any command that appears in the Command Palette](/usage/types/command), [open a link](/usage/types/link) (including deep links), and [run templater templates](/usage/types/template).

A button codeblock looks like this:

\`\`\`button
name My Super Button
type command
action Toggle Pin
\`\`\`
^button-super

And renders like this:
![](/content/images/button-example.png)

You can also render a button inline. Create the button codeblock and then reference it using the button block id: \`button-super\`

To get started quickly making buttons there is a [Button Maker](/maker) command that will walk you through button creation step-by-step.

There are also some advanced feautures like:
- [Button Mutations](/usage/mutations)
- [Swap Buttons](/usage/types/swap)
- [Templater inside Buttons](/templater)


## Issues

If you face an issue using Buttons please head to the [OMG Discord](https://discord.com/invite/obsidianmd) and ping @shabegom in the #plugin-general channel. If Discord isn't your thing you could ask for help in the [Obisidan Forums](https://forum.obsidian.md/).

Please don't file issues on GitHub unless the problem is a bug in Buttons itself.
