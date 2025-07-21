# Test Cursor Replace Functionality

Here's a test of the new `replace [cursor]` feature:

Line 1: Keep this line
Line 2: Place cursor here and click the button to remove this line
Line 3: This line should also stay
Line 4: Another line that could be removed if cursor is placed here
Line 5: Final line to keep

```button
name Remove Line at Cursor
type append text
action ✅ Line removed successfully!
replace [cursor]
```
^button-test-cursor

## Instructions

1. Place your cursor anywhere on one of the lines above
2. Click the "Remove Line at Cursor" button
3. The line where your cursor was positioned should be removed
4. The success message will be appended to the end of the file

This demonstrates the new `[cursor]` argument for the replace mutation which allows for interactive line removal based on cursor position. 