# Test: Inline Buttons with Templater in Edit Mode

This test file verifies that inline buttons work correctly with templater=true in edit mode.

## Test Button 1: Basic Templater Command
```button
name Current Time
type append text
action Current time: <% tp.date.now("YYYY-MM-DD HH:mm:ss") %>
templater true
```
^button-current-time

## Test Button 2: Templater with File Operations
```button
name File Info
type append text
action File: <% tp.file.title %> | Created: <% tp.file.creation_date("YYYY-MM-DD") %>
templater true
```
^button-file-info

## Test Button 3: Template Button with Templater
```button
name Daily Log
type append template
action Daily Log Template
templater true
```
^button-daily-log

## Inline Button Tests

### Test the buttons inline (edit mode):
- Click this button to append current time: `button-current-time`
- Click this button to append file info: `button-file-info`
- Click this button to append daily log: `button-daily-log`

### Expected Behavior:
1. In edit mode (source mode), the inline buttons should display correctly as clickable buttons
2. When clicked, templater commands should be processed and executed
3. The templater syntax (<%...%>) should be converted to actual values
4. No errors should appear in the console
5. The buttons should work the same as regular buttons but inline

### Test Results:
- [ ] Inline buttons display correctly in edit mode
- [ ] Templater commands are processed when clicked
- [ ] No console errors appear
- [ ] Results match expected templater output
- [ ] Buttons work consistently with regular button behavior

## Notes:
- This test specifically addresses the bug where inline buttons weren't working with templater=true in edit mode
- The fix adds templater processing logic to the ButtonWidget.handleButtonClick method in livePreview.ts
- This ensures parity between regular buttons and inline buttons when using templater functionality 