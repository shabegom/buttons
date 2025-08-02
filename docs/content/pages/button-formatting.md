---
title: Button Formatting
date: 2025-07-31T00:00:00.000Z
permalink: /usage/formatting.html
eleventyNavigation:
  order: 5
  key: formatting
  parent: usage
  title: "Formatting"
---

**Button formatting** gives you complete control over button appearance and layout. You can create multi-line buttons with markdown support, control dimensions, and precisely align content within your buttons.

## Multi-line Button Names

Create buttons with multiple lines of text using delimiters and full markdown support:

### Using Curly Braces `{}`

<pre>
```button
name {
🚀 **Launch Process**
*Execute with style*
→ Click to proceed
}
type command
action Toggle Pin
```
^button-multiline-curly
</pre>

### Using Square Brackets `[]`

<pre>
```button
name [
# Action Required
- [x] Step 1 Complete
- [ ] Step 2 Pending
`Click to continue`
]
type command
action Toggle Pin
```
^button-multiline-square
</pre>

Both `{}` and `[]` delimiters work identically - choose whichever feels more natural for your content.

## Markdown Support

Button names support full markdown formatting:

- **Bold text**: `**bold**` or `__bold__`
- **Italic text**: `*italic*` or `_italic_`
- **Code spans**: `` `code` ``
- **Headers**: `# Header`, `## Subheader`
- **Lists**: `- item` or `1. item`
- **Links**: `[text](url)`
- **Emojis**: 🚀 📝 ✅

<pre>
```button
name {
## 📋 Task Manager
**Current Status:** *In Progress*
- Review documents
- `Execute workflow`
- Submit report
}
type command
action Toggle Pin
```
^button-markdown-example
</pre>

## Button Dimensions

Control the exact size of your buttons using `width` and `height` arguments:

### Width Control

Set button width in `em` units:

<pre>
```button
name Short Button
type command
action Toggle Pin
width 10
```
^button-width-small
</pre>

<pre>
```button
name This is a much longer button that fits in a constrained width
type command
action Toggle Pin
width 20
```
^button-width-large
</pre>

### Height Control

Set button height in `em` units:

<pre>
```button
name {
Multiple
Line
Button
}
type command
action Toggle Pin
height 5
```
^button-height-example
</pre>

**Note:** Height sets the minimum button height. Content will never be clipped, but extra space will be added if needed.

## Text Alignment

Control how text is positioned within your buttons using the `align` argument:

### Horizontal Alignment

- `left` - Align text to the left
- `center` - Center text horizontally (default)
- `right` - Align text to the right

<pre>
```button
name Left Aligned
type command
action Toggle Pin
width 20
align left
```
^button-align-left
</pre>

### Vertical Alignment

- `top` - Align text to the top
- `middle` - Center text vertically (default)
- `bottom` - Align text to the bottom

**Note:** Vertical alignment only works when a `height` is specified.

<pre>
```button
name {
Top
Aligned
Text
}
type command
action Toggle Pin
height 6
align center top
```
^button-align-top
</pre>

### Combined Alignment

You can combine horizontal and vertical alignment:

<pre>
```button
name {
Bottom
Right
Corner
}
type command
action Toggle Pin
width 15
height 5
align right bottom
```
^button-align-combined
</pre>

## Advanced Examples

### Dashboard-Style Button

<pre>
```button
name {
📊 **Analytics Dashboard**
*Last updated: Today*
View detailed metrics →
}
type link
action https://analytics.example.com
width 22
height 4
align center middle
color blue
```
^button-dashboard
</pre>

### Status Indicator Button

<pre>
```button
name [
🟢 **System Status**
All services operational
Last check: `2 minutes ago`
]
type command
action System Status Check
width 18
height 4
align left top
color green
```
^button-status
</pre>

### Action Panel Button

<pre>
```button
name {
⚡ **Quick Actions**
1. Sync files
2. Clear cache  
3. Restart service
}
type chain
actions [
  {"type": "command", "action": "Sync Files"},
  {"type": "command", "action": "Clear Cache"},
  {"type": "command", "action": "Restart Service"}
]
width 16
height 5
align left middle
```
^button-action-panel
</pre>

## Combining with Other Features

Button formatting works seamlessly with all other button features:

- **Colors**: Use with `color` or `customcolor` arguments
- **CSS Classes**: Apply with `class` argument for additional styling
- **Button Types**: Works with all button types (command, link, template, etc.)
- **Templater**: Compatible with templater commands
- **Chain Actions**: Perfect for complex multi-step workflows

<pre>
```button
name {
🎨 **Custom Styled**
*Multi-line button*
with formatting
}
type command
action Toggle Pin
width 15
height 4
align center middle
color purple
class my-custom-button
```
^button-everything
</pre>

## Best Practices

1. **Keep it readable**: Don't overcrowd buttons with too much text
2. **Consistent sizing**: Use similar dimensions for related buttons
3. **Meaningful alignment**: Align text based on content hierarchy
4. **Test both themes**: Verify appearance in light and dark modes
5. **Mobile considerations**: Ensure buttons work well on smaller screens

## Tips & Tricks

- Use emojis to make buttons more visually appealing
- Headers (`#`) in button names create visual hierarchy
- Lists work great for showing multiple actions or status items
- Code spans (`` `code` ``) highlight important values or actions
- Combine formatting with colors for better visual categorization

Button formatting transforms simple buttons into rich, informative interface elements that enhance your workflow and make your notes more interactive and visually appealing.