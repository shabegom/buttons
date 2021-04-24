# Obsidian Buttons

Run commands and open links by clicking on ✨ Buttons ✨

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

| argument | description                                | options                                      | example    |
-----------|--------------------------------------------|----------------------------------------------|------------|
| name    | **required**: the name of the button                                                                                                          | any string                                              | My Button                    |
| type    | **required** run a command or open a url                                                                                                      | command, link, template, calculate                      | command                      |
| action  | **required** depending on button type this will be a command, link, template, or equation                                                     | Toggle Pin or https://obsidian.md or My Template or 1+2 | Toggle Pin                   |
| color   | optional: arg to change color of the button                                                                                                   | blue, green, red, purple. yellow                        | blue                         |
| class   | optional: add a class to the button for more customized styling. **Adding a custom class will remove default classes**                        | a string representing your custom class                 | button-default, button-shine |
| id      | optional: add a custom id to the button for styling                                                                                           | a string representing your custom id                    | myId                         |
| remove  | optional: if `true` removes button after command runs                                                                                         | true                                                    | true                         |
| replace | optional: specify a section header above the button and it will remove content from the section (and replace if used with _prepend template_) | The section header directly above the button            | ## Replace this Section      |

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
- `name` must be the first argument in the button
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

#### Requirements
- `name` must be the first argument in the button

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

### Custom Class & ID

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

if you add `remove true` as the las argument, the button will be removed from the file after the button click.  
**Use at your own risk! Deleting things can be dangerous, so make sure to test your button in a safe note**

#### Requirements
- first argument must be `name`
- last argument must be `remove true`
- `name` must be unique in the file

\`\`\`button  
name My Removable Button  
type command  
action Some Command that adds content  
remove true  
\`\`\`  

### Replace content in section

if you add `replace` and specify a section header, the button will replace content in that section.  
For right now, you should use this with `type prepend template` unless you know the output will appear above the button. This implementation assumes the content you want to replace is between the specified header and the button.  
**Use at your own risk! Deleting things can be dangerous, so make sure to test your button in a safe note**

#### Requirements
- first argument must be `name`
- The button must be directly below the content you want to replace.

\`\`\`button  
name My Replace Button  
type prepend template  
action A Template  
replace ## Section Heading   
\`\`\`  

## Known Issues
- The `remove` command gets funky if the button adds a button of the same name via a `template`

## Releases

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
