# Test Prepend Template Fix

This file tests the fix for issue #217 where prepend template was being inserted inside the button code instead of at the beginning of the document.

## Test Case

The button below should prepend content to the beginning of this document, not inside the button code:

```button
name Test Prepend Template
type prepend template
action test-template
color purple
```
^button-testPrepend

## Expected Behavior

When clicked, the button should prepend the template content at the very beginning of this document (before the "# Test Prepend Template Fix" heading).

## Before Fix

Previously, the template would be inserted inside the button code block, breaking the button.

## After Fix

The template should be inserted at the beginning of the document while preserving the button functionality. 