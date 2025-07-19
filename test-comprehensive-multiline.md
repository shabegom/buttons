# Comprehensive Multi-line Button Tests

## Test 1: The original issue - blank lines in content

```button
name Multi-line Append
type append text
action ## Meeting Notes
- Topic 1
- Topic 2

## Action Items
- [ ] Task 1
- [ ] Task 2
```
^button-original-issue

## Test 2: Multiple consecutive blank lines

```button
name Multiple Blanks
type append text
action Line 1


Line 4 (after 2 blank lines)



Line 8 (after 3 blank lines)
```
^button-multiple-blanks

## Test 3: Action with other arguments after it

```button
name With Other Args
type append text
action ## Content with blanks

More content here

Final line
color blue
class test-class
```
^button-with-args

## Test 4: Complex formatting preservation

```button
name Complex Format
type append text
action # Project Plan

## Phase 1
- Research
- Planning

## Phase 2
- Development
  - Frontend
  - Backend

## Phase 3
- Testing

- Deployment
```
^button-complex

## Test 5: Code block with internal blanks

```button
name Code With Blanks
type append text
action ```typescript
function test() {
  const a = 1;

  // Comment after blank line

  const b = 2;


  return a + b;
}
```
```
^button-code-blanks

## Test 6: Mixed content types

```button
name Mixed Content
type append text
action ## Header

> Blockquote

```javascript
code();
```

| Table | Header |
|-------|--------|
| Cell  | Data   |

- List item

Final paragraph.
```
^button-mixed

## Test 7: Starting and ending with blanks

```button
name Start End Blanks
type prepend text
action 

## Content

Text here.

```
^button-start-end

## Test Results

Click each button to verify:
- ✅ Content after blank lines appears
- ✅ Multiple blank lines preserved
- ✅ Other button arguments still work
- ✅ Complex formatting maintained
- ✅ Code blocks with internal blanks work
- ✅ Mixed content types handled correctly
- ✅ Leading/trailing blanks preserved 