# Obsidian Buttons

Run commands and open links by clicking on ✨ Buttons ✨

## Manual Install

Grab the [laest release](https://github.com/shabegom/buttons/releases) and add it to: <vault>/.obsidian/plugins/

## Usage
You create a button using a `button` codeblock

\`\`\`button  
name **required**  
type **required**  
action **required**  
color optional  
class optional  
id optional  
remove optional  
\`\`\`

| argument | description                                | options                                      | example    |
-----------|--------------------------------------------|----------------------------------------------|------------|
| name        | **required**: the name of the button                                          | any string                                  | My Button  |
| type        | **required** run a command or open a url                                     | command, link                               | command    |
| action      | **required** the command to run or link to open                              | any command from the command palette or url | Toggle Pin |
| color       | optional: arg to change color of the button                     | blue, green, red, purple. yellow            | blue       |
| class | optional: add a class to the button for more customized styling. **Adding a custom class will remove default classes** | a string representing your custom class     | button-default, button-shine    |
| id | optional: add a custom id to the button for styling             | a string representing your custom id        | myId       |
| remove | optional: if `true` removes button after command runs | true | true | 

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

### Template Button

A Template button will append or prepend the specified template into your note. `type` will be _apped template_ or _prepend template_ and `action` is the name of the template you want to insert.  

#### Requirements
- `name` must be the first argument in the button
- the Templates plugin needs to be enabled and a Template folder specified
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

### Custom Class & ID

You can add an optional `customClass` argument to target the button with any css styling tweaks you'd want to add

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

You can also add the default classes to the class argument. There are two defaults: `button-default` and `button-shine`. So if you don't like the shine hover effect you can remove it, but keep default styling:

\`\`\`button  
name My Default Button Without Shine
type link  
action https://booked.email  
class button-default
\`\`\`

You can add multiple classes to the `class` argument including colors:

\`\`\`button  
name My Multi-Class Button
type link  
action https://booked.email  
class button-default button-shine purple myCustomClass
\`\`\`

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

## Known Issues
- The `remove` command gets funky if the button adds a button of the same name via a `template`
