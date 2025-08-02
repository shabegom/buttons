# Obsidian Buttons
Run commands and open links by clicking on ✨ Buttons ✨  

Read the [Documentation](https://buttonslovesyou.com) for more information

---

**last updated:** August 2, 2025

0.9.4
- Feature: Multi-line button names with markdown support using `{}` or `[]` delimiters ([Luca-Harrison])
- Feature: Button width and height controls with `width` and `height` arguments (in em units) ([Luca-Harrison])
- Feature: Button text alignment controls with `align` argument (left/center/right + top/middle/bottom) ([Luca-Harrison])
- Enhancement: Improved button layout and formatting capabilities ([Luca-Harrison])
- Enhancement: Better markdown rendering within button names ([Luca-Harrison])

0.8.4
- Feature: Relative line number positioning with `line(+N)` and `line(-N)` syntax for text and template buttons
- Feature: Relative line number positioning for `replace [+N,+M]` functionality
- Enhancement: Buttons now work portably regardless of their position in the file
- Addresses GitHub issue #165 with improved DataView refresh button capabilities

0.8.0
- Updated the button maker UI for improved user experience
- Feature: Multi-line text buttons for more complex text insertion
- Added comprehensive documentation at https://buttonslovesyou.com

0.7.0
- Append text no longer creates a newline
- Styling improvements to align with default themes
- Chain buttons: run multiple actions with a single button press

0.6.0
- Enhancement: Inline Buttons now work in Live Preview!
- Various bugfixes

---

## Install
You can find Buttons in the list of community plugins!

## Usage
The quickest way to get started with Buttons is to use the Button Maker. You can open the Button Maker from the Command Palette. Here is an overview of the Button Maker options.

- **Name:** The name of your button.
- **Button Type:** Choose which type of button to create your options are:
    - **Command:** Click the Button to run a Command from the Command Palette.
    - **Link:** Click the Button to open a URL or URI.
    - **Calculate:** Click the Button to run a math calculation. Calculate Buttons can reference lines from the note.
    - **Template:** Click the Button to prepend, append, insert, or create a new note from a template note.
    - **Text:** Click the Button to prepend, append, insert, or create a new note with specified text.
    - **Swap:** A Swap Button is a special type of Inline Button. With a Swap Button you can run a different type of Button on each click.
    - **Chain:** A Chain Button lets you run multiple actions in sequence with a single click. See below for details.
- **Action:** Depending on what **Button Type** you choose, you will choose an Action to perform:
    - **Command:** Choose the Command Palette Command to run.
    - **Link:** Write the URL or URI.
    - **Calculate:** Write the math equation.
    - **Template:** Choose Prepend, Append, New Note, or Line and the template you want to use:
        - **Prepend Template:** Click the Button to prepend a template into the current note.
        - **Append Template:** Click the Button to append a template into the current note.
        - **Add Template at Line:** Click the Button to add a template into the current note at the specified line.
        - **New Note From Template:** Choose the Template, write the name of the new note, choose whether the new note should replace the existing tab, open a new tab or split pane.
    - **Text:** Choose Prepend, Append, New Note, or Line and the text you want to use:
        - **Prepend Template:** Click the Button to prepend text into the current note.
        - **Append Template:** Click the Button to append text into the current note.
        - **Add Template at Line:** Click the Button to add text into the current note at the specified line.
        - **New Note From Template:** Write the name of the new note, choose whether the new note should open in a split pane.
    - **Swap:** Write the button-block-ids of the Buttons the Swap Button will be on each click, e.g. `[id1, id2]` (for more information on Swap Buttons, see below).
- **Remove:** You can remove the Button after you click it. You can also remove other Buttons in the note by supplying an array of button-block-ids, e.g. `[id1, id2]`.
- **Replace:** You can remove lines from the existing note which can then be replaced using the **Append Template** or **Prepend Template** Button types. Write an array with the starting and ending line numbers, e.g. `[startingLine, endingLine]`.
- **Inherit:** By adding a button-block-id of another Button, the Button you are making can inherit arguments.
- **Templater:** If the templater arg is `true` you can include a Templater command inside your button. The command will be converted to its value when the button is clicked and converted back to the command after. This cannot be used with Inline Buttons.
- **Custom Class:** Supply a custom CSS class to style your Button.
- **Color:** Choose a Button color.
- **Multi-line Names:** Create multi-line button names using `{}` or `[]` delimiters with full markdown support for formatting.
- **Width:** Control button width using the `width` argument (in em units), e.g., `width 15`.
- **Height:** Control button height using the `height` argument (in em units), e.g., `height 3`.
- **Align:** Control text alignment within buttons using `align` with horizontal (left/center/right) and vertical (top/middle/bottom) options, e.g., `align center middle`.

### Button Block ID
The button-block-id is a block-id placed direcly below a Button codeblock and starts with `button`, e.g. `^button-id`. Button-block-ids can be used to:
- Create inline buttons (see below for details on inline buttons) `button-button1`
- Choose which Buttons to use in an Inline Swap Button: `swap [button1, button2]`
- Inherit arguments from another Button: `id button1`
- Remove multiple Buttons with a `remove [button1, button2]` argument

### Inline Buttons
Inline Buttons can be created inline with other text, or other Buttons. An Inline Button is essentially a copy of an existing Button codeblock placed inline. To create an inline button:
1. Create a regular Button using the Button Maker or hand-written Button codeblock.
2. Ensure your Button has a unique button-block-id.
3. Go to the note you want an inline Button and run the Insert Inline Button Command, or write the button-block-id between backticks, e.g. `button-id`.

Inline Buttons must start with `button`, whereas other usages of the button-block-id only require the id.

### Swap Button
A Swap Button is a special type of Inline Button. When you click a Swap Button it cycles through multiple other Buttons. Use a Swap Button to run a succession of actions with one Button. To Create a Swap Button:
1. Create Buttons that perform the actions you want the Swap Button to do. Ensure each button has a unique button-block-id.
2. Create a Swap Button and supply the button-block-id of the other buttons, e.g. `swap [id1, id2, id3]`. Ensure the Swap Button has a unique button-block-id.
3. Insert the Swap Button as an Inline Button using the Insert Inline Button Command.

Swap Buttons can currently only be used as Inline Buttons.

### Chain Button

A **Chain Button** allows you to run multiple actions in sequence with a single click. Each action can be any supported button type (command, text, template, link, calculate, copy, or even another chain).

**Syntax:**
```button
name Manage Field
type chain
actions [
  {"type": "append text", "action": "exercise::"},
  {"type": "command", "action": "Metadata Menu: Manage field at cursor"}
]
```
^button-manage-field

- The `actions` field must be a valid JSON array of objects, each with a `type` and `action`.
- Actions are executed in order, top to bottom.
- You can mix and match any supported action types.
- You can nest chain actions for advanced workflows.

**Example:**
```button
name Daily Setup
type chain
actions [
  {"type": "command", "action": "Periodic Notes: Open today's daily note"},
  {"type": "append text", "action": "## Tasks for Today"},
  {"type": "template", "action": "Daily Task Template"}
]
```
^button-daily-setup

**How to Create:**
- Use the Button Maker and select "Chain" as the button type.
- Add as many actions as you need, specifying the type and action for each.

**Notes:**
- If any action fails, the rest will still attempt to run.
- The `actions` field must be valid JSON. If you edit by hand, use a JSON validator if you run into issues.
- For text actions, the `type` must be one of the supported text button types: `append text`, `prepend text`, `line(1) text`, `line(+1) text`, `line(-1) text`, or `note text`.
- Line-based actions support both absolute (`line(5)`) and relative (`line(+2)`, `line(-1)`) positioning.

### Inherit Button Args
If you are using the same (or similar) Buttons across many notes, you can create one parent Button and have other Buttons inherit from the parent.
1. Create a Parent Button with the arguments you'd like to be inherited. Ensure the Parent Button has a unique button-block-id.
2. Create Child Buttons and supply the Parent Button button-block-id `id parentButton`.

Child Buttons can also have their own arguments. Any argument supplied on the Child supersedes arguments from the Parent Button.

### Templater Button
The Templater arg allows you to supply a Templater command inside the Button. The command is converted to its value when the Button is clicked and then converted back to the Templater Command for the next click. This is best used with the New Note Button type.

A button with this command…

    ```button
    name Make an Hourly Note
    type note(<% tp.date.now("HH:MM") %>) template
    action Log Template Note
    templater true
    ```

…will convert when clicked to:

    ```button
    name Make an Hourly Note
    type note(16:20) template
    action Log Template Note
    templater true
    ```

And then `09` will change back to `<% tp.date.now("HH:MM") %>`.

The Templater arg also works with the Text Button type:

    ```button
    name Add Current Time
    type line(1) text
    action <% tp.date.now("HH:mm:ss") %>
    replace [1,1]
    templater true
    ```

This will insert the current time on line one of the note, replacing any existing text on that line and then convert back to the Templater command for future use.

### Button Styling
#### Style Settings
Install the Style Settings plugin for an easy way to change the default Button styling.

#### Custom Class
If you want a truly custom style, or want Buttons with multiple different styles, you can add a `class` argument in a Button and use a css snippet to style it.

### Remove Button after command execution
If you have a Button that only needs to run once and then can be removed from a note (handy for inserting prompts into a Daily Note) you can add a `remove true` argument to your Button.

If you have multiple Buttons in a note and want to remove them all when a Button is clicked, you can supply an array of button-block-ids to the `remove` argument, e.g. `remove [id1, id2, id3]`.

### Replace content in section
When using Template or Text Buttons, you can remove lines from the existing note which will be replaced by new content. Use the `replace` argument with absolute or relative line numbers:

- **Absolute positioning**: `replace [1, 5]` removes lines 1 through 5
- **Relative positioning**: `replace [+1, +3]` removes 3 lines starting 1 line after the button
- **Mixed positioning**: You can also mix absolute and relative: `replace [10, +5]`

Relative positioning is perfect for portable templates that work regardless of where they're placed in your document.

## Examples
### Command Button
Open the previous day's daily note using the Periodic Notes Plugin:

    ```button
    name Open Previous Daily Note
    type command
    action Periodic Notes: Open previous daily note
    ```
    ^button-previous

Turn spellcheck on/off:

    ```button
    name Toggle spellcheck
    type comand
    action Toggle spellcheck
    color blue
    ```
    ^button-spellcheck

### Link Button
Open the Obsidian Forum:

    ```button
    name To the Forum Batman!
    type link
    action https://forum.obsidian.md/
    ```
    ^button-forum

### Template & Line Button
#### Append

Append a Log Template Note:

    ```button
    name Log
    type append template
    action Hourly Log Template Note
    ```
    ^button-log

Append the current time:

    ```button
    name Log
    type append text
    action <% tp.date.now("HH:mm") %>
    templater true
    ```

#### Prepend Template
Replace a Weather Template Note with the updated Weather:

    ```button
    name Current Weather
    type prepend template
    action Weather Template Note
    replace [1,5]
    ```
    ^button-weather

Prepend a weekly todo list and remove other buttons:

    ```button
    name Monday List
    type prepend template
    action Monday Template Note
    remove [mon,tues,wed]
    ```
    ^button-mon

    ```button
    name Tuesday List
    type prepend template
    action Tuesday Template Note
    remove [mon,tues,wed]
    ```
    ^button-tues

    ```button
    name Wednesday List
    type prepend template
    action Wednesday Template Note
    remove [mon,tues,wed]
    ```
    ^button-wed

Even better, set up those buttons and then add them all on one line as Inline Buttons:

    `button-mon` `button-tues` `button-wed`

### Add Template at Line
Insert templates at specific lines using absolute or relative positioning:

#### Absolute Line Positioning
    ```button
    name Current Weather (Absolute)
    type line(1) template
    action Weather Template Note
    replace [1,5]
    ```
    ^button-weatherLine-absolute

#### Relative Line Positioning
Perfect for portable templates that work anywhere in your document:

    ```button
    name Current Weather (Relative)
    type line(+1) template
    action Weather Template Note
    replace [+1,+3]
    ```
    ^button-weatherLine-relative

#### New Note From Template
Create a new note in a new split pane for an upcoming meeting based on a Meeting Note Template:

    ```button
    name New Meeting
    type note(Meeting, split) template
    action Meeting Note Template
    ```
    ^button-meeting

Dynamically add the hour and minute to the note title and open as a new tab:

    ```button
    name New Meeting
    type note(Meeting-<%tp.date.now("HH-MM") %>, tab) note
    action Meeting Note Template
    templater true
    ```
    ^button-meeting2

### Calculate Button
Do some simple math:

    ```button
    name Add Em Up
    type calculate
    action 2+2
    ```
    ^button-add

Reference numbers outside of the Button:

    Bananas Have: 5  
    Bananas Lost: 5

    ```button
    name How Many Bananas Today?
    type calculate
    action $1-$2
    color yellow
    ```
    ^button-bananas

Natural Language Math:

    5 dogs plus 2 cats divided by 2 people

    ```button
    name Who Get The Pets?
    type calculate
    action $1
    class sad-button
    ```
    ^button-breakup

The calculate button uses [math-expression-evaluator](https://github.com/bugwheels94/math-expression-evaluator), so it should support any symbol supported by that library.

### Button Formatting Examples

#### Multi-line Button with Markdown

    ```button
    name {
    🚀 **Launch Process**
    *Execute with style*
    → Click to proceed
    }
    type command
    action Toggle Pin
    width 18
    height 4
    align center middle
    ```
    ^button-formatted

#### Sized and Aligned Button

    ```button
    name Action Button
    type command
    action Toggle Pin
    width 12
    height 2
    align right top
    color blue
    ```
    ^button-sized  

### Swap Buttons
Let's create a Swap Button using the button-block-id of previous Buttons:

    ```button
    name Crazy Swap Button
    swap [add,meeting,forum]
    ```
    ^button-swap

Then insert that button inline:

    `button-swap`

1. On the first click of Crazy Swap Button we will add 2+2.
2. On the second click of Crazy Swap Button we will create a new Meeting note.
3. On the third click of the Crazy Swap Button we will go to the Obsidian forum.

Note: swap count is reset if you close the note.

## Releases

### 0.8.0
- Updated the button maker UI for improved user experience
- Feature: Multi-line text buttons for more complex text insertion
- Added comprehensive documentation at https://buttonslovesyou.com

### 0.7.0
- Append text no longer creates a newline
- Styling improvements to align with default themes
- Chain buttons: run multiple actions with a single button press

### 0.6.0
- Enhancement: Inline Buttons now work in Live Preview!
- Various bugfixes

### 0.5.1
- Bugfix: Templater commands that move, rename, etc should be working again
- The default templates plugin should be working again
- sets a default name for a button so problems don't happen.

### 0.5.0
- Enhancement: Moved to more reliable templater processor ([shabegom])
- Bugfix: buttons now render in Live Preview mode when Obsidian starts ([Lx])
- Bugfix: improve reliability of `templater` option ([Lx])
- Enhancement: improve speed of `remove` option ([Lx])
- Feature: Add default folder and prompt for name settings ([unxok])
- Features: Button type copy for "copy text to clipboard", and custom color for button background and tex ([rafa-carmo])
- Feature: adds hidden attribute to buttons ([Liimurr])
- Enhancement: Create folder for new note if it doesn't exist ([SabriDW])
- Bugfix: fix template search with folders having "/" prefixed ([Balake])
- Feature: Open new tab when creating new file ([0snug0])
- Update Readme: new note from template ([antulik])


[Lx]: https://github.com/Lx
[unxok]: https://github.com/unxok
[rafa-carmo]: https://github.com/rafa-carmo
[Liimurr]: https://github.com/Liimurr
[SabriDW]: https://github.com/SabriDW
[Balake]: https://github.com/Balake
[0snug0]: https://github.com/0snug0 
[antulik]: https://github.com/antulik


### 0.4.4
- Bugfix: blue and purple colors should now work
- Bugfix: reduced the height of the Button Maker for smaller displays

### 0.4.3
- New Line Template Button: insert a template into the current note at a specified line

### 0.4.2
- Scrollable Button Maker
- Add custom button-block-id inside the Button Maker

### 0.4.0
- Inline Buttons! You can add buttons inline using the button block-id (^button-id) using this syntax \`button-id\`
- Insert Inline Button: Use **Insert Inline Button** from the command palette to quickly insert a new inline button
- Button Maker: Open the Button Maker from the command palette to quickly and easily create a new button
- New Button Arg - `swap`: use the `swap [id1, id2, id3]` arg along with an inline button to create a button that performs multiple actions on each click
- New Button Arg - `templater`: the templater arg allows you to put a templater command inside a button. When the button is clicked the templater command is converted to it's value and then is converted back to the templater command: `note(<% tp.date.now("MM-DD") %>) template`

### 0.3.2
- Fix the uncaught Type Error if there are no button block-ids in the vault
- Fix the position error if not on insiders build

### 0.3.0
- You can add a block-id below a button block. The button block-id can be used to inherit arguments from a button or to remove multiple buttons
- `remove` can now be an array of button block-ids to remove (it can still be true to remove the clicked button)
- `replace` now takes an array like [startLine,endLine] to define the start and end line to be replaced.
- `append`, `prepend`, `remove`, `replace` have been updated to use the button position. `name` is no longer required.

### 0.2.10
- Bugfix: new notes created by a template can now have `-` and `!` and other characters in their title.

### 0.2.9
- You can open a note created via template type button in a split pane by using `note(Note Name, split) template`

### 0.2.8
- You can now have the core Templates plugin disabled if you are using Templater. You still need to define a Templates folder

### 0.2.6
- Bugfix for converting button values to lowercase
- add some padding around the button

### 0.2.4
- Add a command palette command to add a button codeblock to a note
- Set default button styles with Style Settings plugin

### 0.2.3: Calculate button type
- Added a `calculate` button type that can do maths and output results
- `calculate` can reference numbers outside the button by their line number
- Bug Fix: Removed extra whitespace when using the append action
- Bug Fix: Button names are now escaped in regex which prevents an error when adding content to a note

### 0.2.2: Remove logging
- Remove mobile logging that was accidentally included in the previous release

### 0.2.1: Styling update
- Updated default button styling

### 0.2.0: Add replace argument and note() template feature
- Removed the shine hover effect because it looked crummy on movible
- Added a `replace` argument that replaces content between a specified header and the button
- Added a `note() template` feature that will create a new note based on a specified template

### 0.1.1: Released to Community Plugins!
- Buttons is now available in the list of community plugins within Obsidian

### 0.1.0: Add template feature
- Added the `template` button type
- prepend or append a specified template into a note

### 0.0.5: Add remove feature
- Added a `remove` argument that removes the button after it is clicked
