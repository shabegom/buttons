# Obsidian Buttons

Run commands and open links by clicking on ✨ Buttons ✨

## Manual Install

Grab the [laest release](https://github.com/shabegom/buttons/releases) and add it to: <vault>/.obsidian/plugins/

## Usage

Buttons have 4 arguments: name, type, action, color

| argument | description                                | options                                      | example    |
-----------|--------------------------------------------|----------------------------------------------|------------|
| name     | the name of the button                     | any string                                   | My Button  |
| type     | run a command or open a url                | command, link                                | command    |
| action   | the command to run or link to open         | any command from the command palette or url | Toggle Pin |
| color    | optional arg to change color of the button | blue, green, red, purple. yellow             | blue       |

You create a button using a `button` codeblock

## Examples

### Command Button

Command buttons can run commands you would find in the Command Paletter. `type` will be _command_ and `action` is the exact wording of the command found in the palette.

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

