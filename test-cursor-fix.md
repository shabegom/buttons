# Test Cursor Position Fix

This tests the fix for cursor-based replace mutation. The cursor position should now be captured immediately when the button is clicked, before focus shifts away from the editor.

Line 1: Keep this line
Line 2: Place cursor here and click button to remove this line
Line 3: Keep this line
Line 4: Or place cursor here to remove this line instead
Line 5: Keep this line too

```button
name Remove Line at Cursor (Fixed)
type append text
action ✅ Line removed successfully! The cursor position was captured correctly.
replace [cursor]
```
^button-cursor-fix

## Instructions

1. Place your cursor on any line above (e.g., Line 2 or Line 4)
2. Click the "Remove Line at Cursor (Fixed)" button
3. The line where your cursor was positioned should be removed
4. Success message should be appended

**Expected behavior**: The line at your cursor position should be removed, not the first line of the file.

This fix captures the cursor position immediately when the button is clicked, before the editor loses focus. 