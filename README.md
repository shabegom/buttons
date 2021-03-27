# Obsidian Buttons

Run commands and open links by clicking on ✨ Buttons ✨

## Manual Install

Grab the latest release and add it to: <vault>/.obsidian/plugins/

## Usage

Buttons have 4 arguments: name, type, action, color

| argument | description                                | options                                      | example    |
| name     | the name of the button                     | any string                                   | My Button  |
| type     | run a command or open a url                | command, link                                | command    |
| action   | the command to run or link to open         | any command from the command paletter or url | Toggle Pin |
| color    | optional arg to change color of the button | blue, green, red, purple. yellow             | blue       |

You create a button using a `button` codeblock

Example command button:

```
```button
name My Awesome Button
type command
action Toggle Pin
color blue
```
```

Example link button:

```
```button
name My Link Button
type link
action https://booked.email
```
```

