# Test Split Options for Note Opening

This file tests all the different opening options for `type note(title, open)` functionality.

## Basic Note Creation (Default)

```button
name Create Basic Note
type note(Basic Test Note) text
action # Basic Test Note

This note should open in the same pane as the current note.

## Content
- Item 1
- Item 2
- Item 3
```

## Vertical Split (vsplit)

```button
name Create Note in Vertical Split
type note(Vertical Split Note, vsplit) text
action # Vertical Split Note

This note should open in a vertical split pane.

## Features
- Opens in vertical split
- Good for side-by-side comparison
- Useful for reference materials

## Content
- Feature A
- Feature B
- Feature C
```

## Horizontal Split (hsplit)

```button
name Create Note in Horizontal Split
type note(Horizontal Split Note, hsplit) text
action # Horizontal Split Note

This note should open in a horizontal split pane.

## Features
- Opens in horizontal split
- Good for viewing content above/below
- Useful for long documents

## Content
- Section 1
- Section 2
- Section 3
```

## Legacy Split (split)

```button
name Create Note in Legacy Split
type note(Legacy Split Note, split) text
action # Legacy Split Note

This note should open in a split (vertical by default for backwards compatibility).

## Features
- Backwards compatible with existing buttons
- Opens in vertical split
- Maintains existing behavior

## Content
- Legacy item 1
- Legacy item 2
- Legacy item 3
```

## New Tab (tab)

```button
name Create Note in New Tab
type note(New Tab Note, tab) text
action # New Tab Note

This note should open in a new tab.

## Features
- Opens in new tab
- Keeps current note open
- Good for multi-tasking

## Content
- Tab item 1
- Tab item 2
- Tab item 3
```

## Same Window (same)

```button
name Create Note in Same Window
type note(Same Window Note, same) text
action # Same Window Note

This note should open in the same window, replacing the current note.

## Features
- Replaces current note
- Good for navigation
- Keeps workspace clean

## Content
- Same window item 1
- Same window item 2
- Same window item 3
```

## Don't Open (false)

```button
name Create Note Without Opening
type note(Background Note, false) text
action # Background Note

This note should be created but not opened.

## Features
- Creates file in background
- Doesn't change current view
- Good for batch operations

## Content
- Background item 1
- Background item 2
- Background item 3
```

## Template Integration Tests

### Template with Vertical Split

```button
name Template Vertical Split
type note(Template VSplit, vsplit) template
action Test Template
```

### Template with Horizontal Split

```button
name Template Horizontal Split
type note(Template HSplit, hsplit) template
action Test Template
```

### Template with New Tab

```button
name Template New Tab
type note(Template Tab, tab) template
action Test Template
```

### Template with Same Window

```button
name Template Same Window
type note(Template Same, same) template
action Test Template
```

### Template with Don't Open

```button
name Template Background
type note(Template Background, false) template
action Test Template
```

## Templater Integration Tests

### Templater with Vertical Split

```button
name Templater Vertical Split
type note(Templater VSplit, vsplit) template
action Test Template
templater true
```

### Templater with Horizontal Split

```button
name Templater Horizontal Split
type note(Templater HSplit, hsplit) template
action Test Template
templater true
```

### Templater with New Tab

```button
name Templater New Tab
type note(Templater Tab, tab) template
action Test Template
templater true
```

### Templater with Same Window

```button
name Templater Same Window
type note(Templater Same, same) template
action Test Template
templater true
```

### Templater with Don't Open

```button
name Templater Background
type note(Templater Background, false) template
action Test Template
templater true
```

## Edge Cases

### Note with Commas in Title

```button
name Test Comma Title
type note(Note, with commas, vsplit) text
action # Note with commas

This tests handling of commas in note titles.
```

### Note with Special Characters

```button
name Test Special Chars
type note(Note-with-dashes_and_underscores, hsplit) text
action # Note with special characters

This tests handling of special characters in note titles.
```

### Note in Folder

```button
name Test Folder Note
type note(folder/Subfolder Note, tab) text
action # Note in folder

This tests creating notes in folders.
folder test-folder
```

## Summary

This test file covers all the opening options:

- ✅ **vsplit**: Vertical split (right side)
- ✅ **hsplit**: Horizontal split (bottom)
- ✅ **split**: Legacy split (vertical for backwards compatibility)
- ✅ **tab**: New tab
- ✅ **same**: Same window (replaces current)
- ✅ **false**: Don't open (background creation)

All options maintain backwards compatibility and work with both text and template content, including Templater integration. 