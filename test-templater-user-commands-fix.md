# Test for Issue #212: Templater User Commands Fix

This test file demonstrates that the fix for [Issue #212](https://github.com/shabegom/buttons/issues/212) resolves the problem where buttons with templater user commands would disappear.

## Problem Description

Previously, buttons containing templater syntax like `<% tp.user.functionName() %>` would:
- Disappear entirely from the interface
- Throw the error: `Cannot read properties of undefined (reading 'path')`
- Prevent the button from rendering at all

## Test Cases

### 1. Basic Templater Date Function
This should work without issues:

```button
name Current Time
type note(Note-<% tp.date.now("YYYY-MM-DD-HH-mm-ss") %>) template
action Test Template
templater true
```
^button-basic-templater

### 2. Templater User Function (Main Issue)
This was the problematic case from the issue:

```button
name Add Test Item
type note(Test-<% tp.user.getTestNumber(tp, "TEST") %>) template
action Test Template
templater true
```
^button-user-function

### 3. Multiple Templater Functions
Test with multiple templater functions:

```button
name Complex Example
type note(Complex-<% tp.date.now("YYYY-MM-DD") %>-<% tp.user.getCounter() %>) template
action Test Template
templater true
```
^button-complex

### 4. Templater in Different Button Types
Test with different button types:

```button
name Templater Text
type append text
action Current time: <% tp.date.now("HH:mm:ss") %>
templater true
```
^button-text-templater

## Expected Behavior After Fix

✅ **All buttons should render correctly**
- No buttons should disappear from the interface
- All buttons should be clickable and functional
- No console errors related to `Cannot read properties of undefined (reading 'path')`

## Test Instructions

1. Load this file in Obsidian with the Buttons plugin enabled
2. Ensure Templater plugin is installed and configured
3. Create any necessary user functions (like `getTestNumber` or `getCounter`)
4. Verify all buttons render properly
5. Test clicking the buttons to ensure they work
6. Check browser console for any errors

## Technical Details

The fix involved:
- Correcting the templater function call to pass proper parameters
- Using the same file for all templater configuration properties when processing inline syntax
- Adding proper error handling to prevent crashes
- Ensuring the templater configuration works correctly for button source processing

## Related Files Changed

- `src/index.ts` - Fixed templater function call and added error handling
- `src/templater.ts` - Updated function signature and configuration
- `src/handlers.ts` - Updated all templater calls to pass app parameter
- `src/buttonTypes.ts` - Updated processTemplate call

## Issue Reference

Fixes: https://github.com/shabegom/buttons/issues/212 