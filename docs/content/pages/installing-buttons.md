---
title: Installing Buttons
date: 2022-10-16T17:08:41.383Z
permalink: install.html
eleventyNavigation:
  order: 2
  title: Install Buttons
  key: install
---

Buttons is easy to install and works great out of the box. You can find it in [Community Plugins in Obsidian](obsidian://show-plugin?id=buttons).

## Installation Steps

1. **Open Community Plugins**: Go to Settings → Community Plugins in Obsidian
2. **Browse Plugins**: Click "Browse" to open the Community Plugins directory
3. **Search for Buttons**: Type "Buttons" in the search bar
4. **Install**: Click "Install" on the Buttons plugin by shabegom
5. **Enable**: Toggle the switch to enable the Buttons plugin

That's it! You're ready to start creating buttons.

## What's New in Version 0.7.0

**Latest Features:**
- **[Chain Buttons](/usage/types/chain)**: Run multiple actions in sequence with one click
- **Improved Styling**: Better integration with default Obsidian themes
- **Enhanced Live Preview**: Inline buttons now work seamlessly in Live Preview mode
- **Bug fixes**: Various performance improvements and stability fixes

## Getting Started

After installation, you have several ways to create your first button:

### Option 1: Use the Button Maker
The easiest way to get started is with the [Button Maker](/maker):
1. Open Command Palette (`Ctrl/Cmd + P`)
2. Type "Button Maker" and press Enter
3. Fill out the form with your button details
4. Click "Insert Button"

### Option 2: Insert Button Command
For quick button creation:
1. Open Command Palette (`Ctrl/Cmd + P`) 
2. Type "Insert Button" and press Enter
3. Follow the guided setup

### Option 3: Write Button Code
For advanced users who prefer writing code directly:

<pre>
```button
name My First Button
type command
action Toggle Pin
```
^button-first
</pre>

## Plugin Compatibility

Buttons works great with these popular plugins:

**[Templater](obsidian://show-plugin?id=templater-obsidian)**: Add dynamic content to your buttons with date/time, file information, and user input prompts. See [Templater Integration](/usage/templater).

**[Style Settings](obsidian://show-plugin?id=obsidian-style-settings)**: Customize button appearance without writing CSS. See [Button Styling](/usage/styling).

**Templates (Core Plugin)**: Use Obsidian's built-in templates with [Template Buttons](/usage/types/template).

**Periodic Notes**: Perfect for creating buttons that work with daily, weekly, and monthly notes.

## Requirements

- **Obsidian**: Version 0.12.0 or later
- **Operating System**: Windows, macOS, Linux, iOS, Android
- **Live Preview**: Recommended for the best inline button experience
- **No Dependencies**: Buttons works standalone without requiring other plugins

## Settings and Configuration

Buttons doesn't require any initial configuration and works immediately after installation. However, you can customize its behavior:

**Button Styling**: Use the [Style Settings](obsidian://show-plugin?id=obsidian-style-settings) plugin for easy visual customization, or create custom CSS snippets for advanced styling. See [Button Styling](/usage/styling).

**Templates Setup**: If you plan to use [Template Buttons](/usage/types/template), ensure you have either:
- Obsidian's core Templates plugin enabled with a templates folder configured
- The Templater plugin installed and configured

## What's Next?

Once you have Buttons installed, explore these key features:

1. **[Using Buttons](/usage)**: Learn the basics of creating and using buttons
2. **[Button Types](/usage/types)**: Discover all available button types and their uses
3. **[Button Maker](/maker)**: Master the visual button creation interface
4. **[Inline Buttons](/usage/inline)**: Learn to embed buttons within your content
5. **[Button Styling](/usage/styling)**: Customize button appearance to match your theme

Buttons transforms how you interact with your notes, making complex workflows as simple as clicking a button. Start with basic command and link buttons, then explore advanced features like Chain buttons and Templater integration as you become more comfortable with the plugin. 
