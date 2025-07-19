# Test Blank Lines in Multi-line Text Buttons

This file tests that blank lines within multi-line actions are properly handled.

## Test 1: Multi-line with blank lines

```button
name Multi-line Append with Blank Lines
type append text
action ## Meeting Notes
- Topic 1
- Topic 2

## Action Items
- [ ] Task 1
- [ ] Task 2

## Next Steps
- Follow up
```
^button-blank-lines-test

## Test 2: Multiple blank lines

```button
name Multiple Blank Lines
type append text
action ## Header


Content after multiple blank lines.


More content.


End.
```
^button-multiple-blanks

## Test 3: Starting with blank line

```button
name Starting with Blank
type append text
action 

## Content starts after blank line
- Item 1
- Item 2
```
^button-start-blank

## Test 4: Ending with blank lines

```button
name Ending with Blanks
type append text
action ## Some Content
- Item 1
- Item 2


```
^button-end-blank

## Test 5: Copy with blank lines

```button
name Copy with Blank Lines
type copy
action Line 1

Line 3 (with blank line above)

Line 5 (with blank line above)
```
^button-copy-blanks

## Test 6: Code block with blank lines

```button
name Code Block with Blanks
type append text
action ```javascript
function example() {
  console.log("Hello");

  // Blank line above this comment

  console.log("World");
}
```
```
^button-code-blanks

## Expected Results

After clicking each button, you should see:
- All content including text after blank lines
- Proper preservation of empty lines
- No truncation at the first blank line
- Code blocks with internal blank lines preserved 