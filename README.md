# Obsidian Buttons

Run commands and open links by clicking on ✨ Buttons ✨

---

**last updated:** May 6, 2021  
0.3.8
- I think I've fixed most of the bugs introduced in 0.3.0, thanks for your patience!
0.3.0
- You can add a block-id below a button block. The button block-id can be used to inherit arguments from a button or to remove multiple buttons
- `remove` can now be an array of button block-ids to remove (it can still be true to remove the clicked button)
- `replace` now takes an array like [startLine,endLine] to define the start and end line to be replaced.
- `append`, `prepend`, `remove`, `replace` have been updated to use the button position. `name` is no longer required.

Eleanor said I need to put the youtube video here: https://youtu.be/2GSkhIdsmtQ

**known issues with current release**
- If you're not on insiders, or on mobile, your button needs to have a name. I mean, why wouldn't you have a name?

---

## Manual Install

Grab the [latest release](https://github.com/shabegom/buttons/releases) and add it to: <vault>/.obsidian/plugins/

## Usage
You create a button using a `button` codeblock

\`\`\`button  
name **required**  
type **required**  
action **required**  
color optional  
class optional  
id optional  
replace optional  
remove optional  
\`\`\`
^button-myId

| argument | description                                | options                                      | example    |
-----------|--------------------------------------------|----------------------------------------------|------------|
| name    | **required**: the name of the button                                                                                                          | any string                                              | My Button                    |
| type    | **required** run a command or open a url                                                                                                      | command, link, template, calculate                      | command                      |
| action  | **required** depending on button type this will be a command, link, template, or equation                                                     | Toggle Pin or https://obsidian.md or My Template or 1+2 | Toggle Pin                   |
| color   | optional: arg to change color of the button                                                                                                   | blue, green, red, purple. yellow                        | blue                         |
| class   | optional: add a class to the button for more customized styling. **Adding a custom class will remove default classes**                        | a string representing your custom class                 | button-default, button-shine |
| id      | optional: add a block id of an existing button to inherit the arguments of that button                                                                                           | a string representing your the block id                    | myId                         |
| remove  | optional: if `true` removes button after command runs. If array of button ids is supplied, will remove those buttons from note.                                                                                         | true or an array of button ids                                                    | true, [first, second]                         |
| replace | optional: specify a [start,end] array with the line numbers to be replaced | an array with the first item being the line to start replacing and the second item being the line to end            | [1,5]      |
| ^button-myId | optional: give the button a block ID to reference it in other buttons | a unique id that starts with `button` | ^button-uniqueId |

## Examples

### Command Button

Command buttons can run commands you would find in the Command Palette. `type` will be _command_ and `action` is the exact wording of the command found in the palette.

\`\`\`button  
name My Awesome Button  
type command  
action Toggle Pin  
color blue  
\`\`\`

### Link Button

A Link Button will open the specified link in your web browser. `type` will be _link_ and `action` is the link you want to open (https:// is required)

\`\`\`button  
name My Link Button  
type link  
action https://booked.email  
\`\`\`

### Template Button

A Template button will append or prepend the specified template into your note. `type` will be _apped template_,  _prepend template_, or _note(Path/Note Name) template_ and `action` is the name of the template you want to insert.  

#### Requirements
- the Templates or Templater plugin needs to be enabled and a Template folder specified
- the template you want to insert must be in the specified Template folder

\`\`\`button  
name My Template Button  
type prepend template   
action My Template  
\`\`\`

\`\`\`button  
name My Template Button  
type append template   
action My Template  
\`\`\`

\`\`\`button  
name My Template Button  
type note(Path/Note Name) template   
action My Template  
\`\`\`

If you want your note to open in a split write `note(Note Name, split) template` as the type

\`\`\`button  
name My Template Button  
type note(Path/Note Name, split) template   
action My Template  
\`\`\`

The _note()_ type will open the newly created note after creation.  
I'm looking into including variables in the note name to avoid creating many notes. You could achieve this right now by creating a template for the button:  

\`\`\`button  
name My Template Button  
type note(Path/{{date}}) template   
action My Template  
remove true
\`\`\`

and then having another template button that creates the _note() template_ button. Buttons on buttons.

\`\`\`button  
name My Template Button  
type append template   
action My Note Creation Button
\`\`\`

### Calculate Button
A Calculate button will run a math equation and output the results below the button. The equation can be put within the button itself, or be referenced via line number. To reference a line-number, you use a dollar sign and the line number: $2

\`\`\`button  
name Add 1+2  
type calculate  
action 1+2  
\`\`\`  
Result: 3  

_Imagine the following is on line 94 and 95 in your obsidian note_  
apples: 5  
oranges: 3  

\`\`\`button  
name Subtract Apples from Oranges   
type calculate  
action $94-$95  
\`\`\`  
Result: 2  

The calculate button uses [math-expression-evaluator](https://github.com/bugwheels94/math-expression-evaluator), so should support any symbol supported by that library.  

### Button Block ID
If you supply a block ID below the button, you can use the ID in other buttons to inherit the arguments. You can also use the ID to remove buttons from the note.

\`\`\`button  
name My Blue Button
color blue
\`\`\`  
^button-blue

This button will be blue with the name My Blue Button
\`\`\`button  
id blue
\`\`\`  

### Custom Class

You can add an optional `class` argument to target the button with any css styling tweaks you'd want to add

\`\`\`button  
name My Round Link Button  
type link  
action https://booked.email  
class roundButton
id myId
\`\`\`

then in your css tweaks:

```
.roundButton {
 border-radius: 100% !important;
}

#myId {
 color: rebeccapurple;
}
```

You can also add the default classes to the class argument: `button-default`. 

\`\`\`button  
name My Default Button Without Shine
type link  
action https://booked.email  
class button-default myCustomClass
\`\`\`

You can add multiple classes to the `class` argument including colors:

\`\`\`button  
name My Multi-Class Button
type link  
action https://booked.email  
class button-default button-shine purple myCustomClass
\`\`\`

You can edit the default button styles with the Style Settings plugin

### Remove Button after command execution

- if you add `remove true` as the las argument, the button will be removed from the file after the button click.  
- if you supply an array of button IDs `remove` will remove those buttons from the note.

\`\`\`button  
name My Removable Button  
type command  
action Some Command that adds content  
remove true  
\`\`\`  

---

\`\`\`button  
name First Button
\`\`\`  
^button-first

\`\`\`button  
name Second Button
\`\`\`  
^button-second

This button will remove both First Button and Second Button
\`\`\`button  
name My Removable Button  
type command  
action Some Command that adds content  
remove [first, second]
\`\`\`  


### Replace content in section
The `replace` should be an array with two values. The first value indicates the line to start replacing and the second value indicates the line to end replacing. For example `[1,5]` will remove any existing content from lines 1 through 5 in the note. If the Button is below line 5, you would us a `prepend template` type. If you button is above the range indicated to replace you would use the `append template` type. You can also use replace to remove arbitrary lines from a note if use without `prepend` or `append` types.


\`\`\`button  
name My Prepend Replace Button  
type prepend template  
action A Template  
replace [1,5]
\`\`\`  

\`\`\`button  
name My Append Replace Button  
type append template  
action A Template  
replace [7,25]
\`\`\`  


## Releases

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
- Added a `remove` argument. If `remove true` is the last argument in a button the button will be removed from the note after it is clicked.

### 0.0.4: Updated Styling
**This release includes a breaking change from the previous release (0.0.3)**  
- customClass argument is now class
- customId argument is now id
- Adding a class argument will remove default button styling. You can add that styling back by including the class names as values to the class argument:  
`class button-default button-shine`  

### 0.0.3: Add `customId` argument
- Added `customId` to further customize button styles

### 0.0.2: Add `customClass` argument
- Added `customClass` to define your own class for button stylinh

### 0.0.1: Initial Release
- The first release of Buttons!
