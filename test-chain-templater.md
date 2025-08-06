# Test Chain Button with Templater

This file tests the chain button templater fix.

```button
name Time-stamped Entry
type chain
templater true
actions [
  {"type": "append text", "action": "Current time: <% tp.date.now('HH:mm:ss') %>"},
  {"type": "append template", "action": "current-time"}
]
```
^button-timestamped

Current time: 15:53:22
Current time: <% tp.date.now('HH:mm:ss') %>
Current time: 15:53:21
Current time: <% tp.date.now('HH:mm:ss') %>
Current time: 15:53:20
Current time: <% tp.date.now('HH:mm:ss') %>