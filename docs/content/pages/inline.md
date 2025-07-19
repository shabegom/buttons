---
title: Inline Buttons
date: 2022-10-16T17:12:07.067Z
permalink: /usage/inline.html
eleventyNavigation:
  order: 4
  key: inline
  parent: usage
  title: "Inline Buttons"
---

**Inline Buttons** let you place buttons directly within text paragraphs, lists, and other content. They're created by referencing existing button codeblocks using their Button IDs, making it easy to reuse buttons throughout your vault.

## Creating Inline Buttons

### Step 1: Create a Button Codeblock
First, create a regular button with a unique Button ID:

<pre>
```button
name Open Daily Note
type command
action Periodic Notes: Open today's daily note
```
^button-daily
</pre>

### Step 2: Reference the Button Inline
Use the Button ID in backticks to create an inline button:

<pre>
Check out today's tasks: `button-daily`
</pre>

This creates: Check out today's tasks: <button class="text-purple-500 border border-purple-500 hover:bg-purple-500 hover:text-white active:bg-purple-600 font-bold  rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 px-2"><strong>Open Daily Note</strong></button>

## Inline Button Syntax

**Button ID Requirements:**
- Inline Button IDs **must** start with `button`
- Example: `button-daily`, `button-save`, `button-export`
- Other button references only need the ID part: `daily`, `save`, `export`

**Inline Syntax:**
<pre>
`button-[your-id]`
</pre>

## Multiple Inline Buttons

You can place multiple inline buttons in the same line or paragraph:

<pre>
Quick actions: `button-save` `button-export` `button-archive`
</pre>

This creates multiple buttons side by side for quick access.

## Using Inline Buttons in Different Contexts

### In Lists
<pre>
- Morning routine `button-morning`
- Work tasks `button-work`  
- Evening review `button-evening`
</pre>

### In Tables
<pre>
| Project | Status | Action |
|---------|--------|--------|
| Website | In Progress | `button-update-site` |
| App | Planning | `button-plan-app` |
| Docs | Complete | `button-archive-docs` |
</pre>

### In Callouts
<pre>
> [!tip] Quick Actions
> Need to update your daily note? `button-daily-update`
> Want to start a new project? `button-new-project`
</pre>

### Within Sentences
<pre>
When you're ready to begin, click `button-start` and the workflow will begin automatically.
</pre>

## Advanced Inline Button Examples

### Navigation Menu
Create a navigation section with multiple inline buttons:

<pre>
## Quick Navigation
`button-home` `button-projects` `button-archive` `button-settings`
</pre>

### Task Management
<pre>
**Today's Focus:**
- Review emails `button-email-review`
- Update project status `button-status-update`
- Prepare meeting notes `button-meeting-prep`
</pre>

### Template Shortcuts
<pre>
**Templates:** `button-meeting` `button-project` `button-daily` `button-weekly`
</pre>

## Inline Button Features

### Live Preview Support
Inline Buttons work perfectly in Live Preview mode. When you move the cursor away from the inline button reference, it renders as a clickable button.

### Same Functionality
Inline buttons have exactly the same functionality as their source codeblock buttons:
- All button types work (command, link, template, text, etc.)
- [Button mutations](/usage/mutations) work (remove, replace)
- [Templater integration](/usage/templater) works
- Custom styling and colors apply

### Reusability
Once you create a button codeblock, you can reference it inline anywhere in your vault:
- Same note, different locations
- Different notes entirely
- Multiple vaults (if you copy the codeblock)

## Creating Inline Buttons with Commands

### Insert Inline Button Command
1. Place cursor where you want the inline button
2. Run "Insert Inline Button" from Command Palette
3. Select from existing buttons in your vault
4. The inline button reference is inserted automatically

This is faster than typing the button ID manually.

## Best Practices for Inline Buttons

### Organization Strategies
**Centralized Button Library:** Create a dedicated note with all your button codeblocks, then reference them inline throughout your vault.

<pre>
# Button Library

```button
name Quick Note
type note(Quick Note) text
action # Quick Note - <% tp.date.now() %>

## Notes

templater true
```
^button-quick-note

```button  
name Archive Completed
type command
action Move file to another folder
```
^button-archive

# Usage Examples
Use `button-quick-note` for rapid note creation.
Use `button-archive` to clean up completed tasks.
</pre>

**Context-Specific Buttons:** Create buttons within the notes where they're most relevant, then reference them inline in related sections.

### Naming Conventions
- Use descriptive IDs: `button-meeting-setup` not `button1`
- Group related buttons: `button-project-start`, `button-project-update`, `button-project-complete`
- Keep IDs short but meaningful: `button-save` not `button-save-current-document`

### Performance Tips
- Inline buttons are lightweight and don't slow down note rendering
- You can have many inline button references without performance issues
- Button codeblocks are only processed once, regardless of how many inline references exist

## Troubleshooting Inline Buttons

**Button doesn't render:** Check that the Button ID starts with `button` and matches the codeblock ID exactly.

**Wrong button appears:** Ensure Button IDs are unique across your vault.

**Button ID not found:** Verify the source codeblock exists and has the correct Button ID.

**Styling issues:** Make sure any custom classes or colors are defined in the source codeblock, not the inline reference.

Inline Buttons are incredibly powerful for creating clean, functional interfaces within your notes. They let you maintain the power of buttons while keeping your content readable and organized.
