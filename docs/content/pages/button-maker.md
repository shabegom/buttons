---
title: Button Maker
date: 2022-10-16T17:12:07.067Z
permalink: /maker.html
eleventyNavigation:
  order: 10
  key: maker
  title: "Button Maker"
---

The **Button Maker** is a user-friendly interface for creating buttons without writing code by hand. It's the quickest way to get started with Buttons, especially if you're new to the plugin or want to create buttons quickly.

## Opening the Button Maker

You can open the Button Maker in several ways:

1. **Command Palette**: Search for "Button Maker" or "Insert Button"
2. **Ribbon Icon**: Click the button icon in the left sidebar (if enabled)
3. **Right-click menu**: Right-click in a note and select "Insert Button"

## Button Maker Interface

The Button Maker presents all button options in an easy-to-use form:

### Required Fields

**Name**  
The text displayed on your button. This is what users will see and click.

**Button Type**  
Choose from these button types:
- **[Command](/usage/types/command)**: Run a command from the Command Palette
- **[Link](/usage/types/link)**: Open a URL or URI  
- **[Calculate](/usage/types/calculate)**: Perform mathematical calculations
- **[Template](/usage/types/template)**: Insert content from template files
- **[Text](/usage/types/text)**: Insert specified text content
- **[Copy](/usage/types/copy)**: Copy text to clipboard
- **[Chain](/usage/types/chain)**: Run multiple actions in sequence
- **[Swap](/usage/types/swap)**: Cycle through multiple buttons (inline only)

**Action**  
What the button will do when clicked. This varies based on the button type selected.

### Optional Settings

**Button ID**  
A unique identifier for your button. If left blank, one will be generated automatically. Button IDs must start with "button" and be unique across your vault.

**Color**  
Choose from preset button colors:
- Default (no color)
- Blue
- Green  
- Red
- Yellow
- Purple

**Custom Class**  
Add a custom CSS class for advanced styling. Useful if you have custom CSS snippets for button styling.

**Remove After Click**  
Options for removing the button or other buttons after clicking:
- **Don't Remove**: Button stays after clicking
- **Remove This Button**: Button removes itself after clicking  
- **Remove Specific Buttons**: Remove other buttons by their IDs

**Replace Content**  
Replace lines in your note when the button is clicked. Specify start and end line numbers, like `[1,5]` to replace lines 1 through 5.

**Inherit From**  
Inherit settings from another button by specifying its button ID. Child buttons can override parent settings.

**Templater**  
Enable Templater command processing within the button. Check this box if your action contains Templater syntax like `<% tp.date.now() %>`.

## Creating Different Button Types

### Command Button
1. Select "Command" as button type
2. Choose the command from the dropdown list
3. Click "Insert Button"

### Link Button  
1. Select "Link" as button type
2. Enter the URL or URI in the action field
3. Choose a color if desired
4. Click "Insert Button"

### Template Button
1. Select "Template" as button type
2. Choose the template operation:
   - Append Template
   - Prepend Template  
   - New Note From Template
   - Line Template
3. Select your template file from the dropdown
4. For new note templates, specify the note name and opening method

### Text Button
1. Select "Text" as button type
2. Choose the text operation (append, prepend, new note, or line)
3. Enter your text content in the action field
4. For new note text, specify the note name and opening method

### Chain Button
1. Select "Chain" as button type
2. Add actions one by one using the "Add Action" button
3. For each action, specify:
   - Action type (command, text, template, etc.)
   - The specific action to perform
4. Reorder actions by dragging if needed

## Button Maker Tips

### Quick Button Creation
- Use the Button Maker for rapid prototyping of button ideas
- Generate the button code, then customize by hand if needed
- Copy button configurations between notes

### Template Selection
- The Button Maker scans your templates folder automatically
- Templates must be in your configured templates directory
- Both Obsidian Templates and Templater templates are supported

### Command Discovery
- All available commands are listed in the Command dropdown
- This includes core Obsidian commands and plugin commands
- Commands are organized alphabetically for easy browsing

### Chain Button Building
- Start with simple 2-3 action chains
- Test each action individually before combining
- Use the preview to verify your chain logic

### Custom Styling
- Use the Custom Class field for advanced styling
- Create CSS snippets in your `.obsidian/snippets` folder
- Combine with the Style Settings plugin for easy theme switching

## Generated Code

When you click "Insert Button", the Button Maker generates a properly formatted button codeblock:

<pre>
```button
name Example Button
type command
action Toggle Pin
color blue
```
^button-example
</pre>

You can always edit this code by hand after generation to add advanced features or fine-tune the configuration.

## Troubleshooting

**Button doesn't appear**: Make sure you have a unique button ID and that you're not in edit mode.

**Command not working**: Verify the command name matches exactly what appears in the Command Palette.

**Template not found**: Check that your template is in the configured templates directory and has the correct file extension.

**Chain button fails**: Ensure each action in your chain uses valid syntax and references existing resources.

The Button Maker is designed to make button creation accessible to everyone, regardless of technical experience. It handles the syntax and formatting automatically, letting you focus on what you want your buttons to do.
