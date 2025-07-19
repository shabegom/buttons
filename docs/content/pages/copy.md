---
title: Copy Buttons
date: 2024-07-19T00:00:00.000Z
permalink: usage/types/copy.html
eleventyNavigation:
  order: 8
  key: copy
  parent: types
  title: Copy
---

**Copy Buttons** let you quickly copy text to your clipboard. They're perfect for copying frequently used text snippets, commands, URLs, or any other text you need to paste elsewhere.

## Basic Copy Button

<pre>
```button
name Copy Email Template
type copy
action Hello,

I hope this message finds you well. I wanted to follow up on our previous conversation about...

Best regards,
[Your Name]
```
^button-copy-email
</pre>

When clicked, this button copies the email template to your clipboard, ready to paste into any application.

## Copy Button Examples

### Copy Code Snippets
<pre>
```button
name Copy CSS Reset
type copy
action * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```
^button-copy-css
</pre>

### Copy Meeting Link
<pre>
```button
name Copy Zoom Link
type copy
action https://zoom.us/j/1234567890?pwd=example
color blue
```
^button-copy-zoom
</pre>

### Copy Command Line Instructions  
<pre>
```button
name Copy Git Commands
type copy
action git add .
git commit -m "Update documentation"  
git push origin main
```
^button-copy-git
</pre>

### Copy Contact Information
<pre>
```button
name Copy Contact Info
type copy
action John Smith
Phone: (555) 123-4567
Email: john.smith@example.com
LinkedIn: linkedin.com/in/johnsmith
```
^button-copy-contact
</pre>

## Advanced Copy Examples

### Copy Markdown Templates
<pre>
```button
name Copy Meeting Notes Template
type copy
action # Meeting Notes - [Date]

**Attendees:** 
**Date:** 
**Time:** 

## Agenda
1. 
2. 
3. 

## Discussion

## Action Items
- [ ] 
- [ ] 
- [ ] 

## Next Meeting
**Date:** 
**Time:** 
```
^button-copy-meeting-template
</pre>

### Copy Social Media Post
<pre>
```button
name Copy Twitter Post
type copy
action 🚀 Just published a new blog post about productivity tips! 

Key takeaways:
✅ Use time-blocking
✅ Limit notifications  
✅ Take regular breaks

What's your best productivity tip? 👇

#productivity #tips #workflow
```
^button-copy-social
</pre>

### Copy Multi-line Code Block
<pre>
```button
name Copy Python Function
type copy
action def calculate_average(numbers):
    """Calculate the average of a list of numbers."""
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)

# Example usage
scores = [85, 92, 78, 96, 88]
average = calculate_average(scores)
print(f"Average score: {average}")
```
^button-copy-python
</pre>

## Using Copy Buttons with [Templater](/usage/templater)

Make your copy buttons dynamic with Templater commands:

<pre>
```button
name Copy Today's Date
type copy
action <% tp.date.now("YYYY-MM-DD") %>
templater true
```
^button-copy-date
</pre>

### Copy Dynamic Meeting Notes
<pre>
```button
name Copy Meeting Notes
type copy
action # Meeting Notes - <% tp.date.now("MMMM Do, YYYY") %>

**Date:** <% tp.date.now("YYYY-MM-DD") %>
**Time:** <% tp.date.now("h:mm A") %>

## Agenda

## Discussion

## Action Items

templater true
```
^button-copy-dynamic-meeting
</pre>

### Copy Current File Name
<pre>
```button  
name Copy File Reference
type copy
action [[<% tp.file.title %>]] - Referenced on <% tp.date.now("YYYY-MM-DD") %>
templater true
```
^button-copy-file-ref
</pre>

## Copy Button Features

### Multi-line Support
Copy Buttons preserve line breaks and formatting exactly as written in the action field.

### Special Characters  
All special characters are copied correctly:
- Unicode characters: ★ ❤ ➡
- Symbols: @#$%^&*()
- Emoji: 🎯 ✅ 📝 🚀

### Markdown Formatting
Copy Buttons work great with Markdown syntax:
- Headers: `# ## ###`
- Lists: `- * 1.`
- Links: `[text](url)`
- Code: `` `code` `` and code blocks
- Bold/italic: `**bold**` `*italic*`

## Styling Copy Buttons

Customize your Copy Buttons with colors and classes:

<pre>
```button
name Copy Important Note
type copy
action ⚠️ IMPORTANT: Please review the attached documents before the meeting.
color red
class important-copy
```
^button-copy-important
</pre>

## Common Use Cases

**Development:**
- Code snippets and boilerplate
- Git commands and workflows
- API endpoints and configurations
- Terminal commands

**Communication:**
- Email templates and signatures
- Meeting agendas and notes templates
- Social media post templates
- Contact information

**Documentation:**
- Markdown templates
- Table structures
- Reference formats
- Citation templates

**Personal Productivity:**
- Daily/weekly review templates
- Project planning structures
- Habit tracking formats
- Goal setting templates

## Tips for Copy Buttons

1. **Test your content**: Click the button to verify it copies correctly
2. **Format for destination**: Consider where you'll paste the content
3. **Use Templater**: Add dynamic elements like dates and file names
4. **Visual feedback**: Use colors to distinguish different types of copy buttons
5. **Organization**: Group related copy buttons in dedicated notes or sections

Copy Buttons are incredibly useful for streamlining repetitive tasks and ensuring consistency in your text snippets. They're perfect for anyone who frequently copies and pastes similar content across different applications and contexts.