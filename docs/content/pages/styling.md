---
title: Button Styling
date: 2022-10-16T17:12:07.067Z
permalink: /usage/styling.html
eleventyNavigation:
  order: 4
  key: styling
  parent: usage
  title: "Styling"
---

**Button styling** lets you customize the appearance of your buttons using built-in colors, custom CSS classes, and the Style Settings plugin. You can create buttons that match your theme or stand out for specific purposes.

## Built-in Color Options

Buttons come with several pre-defined color options:

### Default Colors
<pre>
```button
name Default Button
type command
action Toggle Pin
```
^button-default
</pre>

<pre>
```button
name Blue Button
type command
action Toggle Pin
color blue
```
^button-blue
</pre>

<pre>
```button
name Green Button
type command
action Toggle Pin
color green
```
^button-green
</pre>

<pre>
```button
name Red Button
type command
action Toggle Pin
color red
```
^button-red
</pre>

<pre>
```button
name Yellow Button
type command
action Toggle Pin
color yellow
```
^button-yellow
</pre>

<pre>
```button
name Purple Button
type command
action Toggle Pin
color purple
```
^button-purple
</pre>

## Style Settings Plugin Integration

The easiest way to customize button appearance is through the **Style Settings** plugin:

1. Install the Style Settings plugin from Community Plugins
2. Go to Settings → Style Settings
3. Find the "Buttons" section
4. Customize default button styles:
   - Background colors
   - Text colors
   - Border styles
   - Hover effects
   - Font sizes and weights

### Style Settings Options
- **Default button color**: Set the base color for all buttons
- **Button border width**: Adjust border thickness
- **Button border radius**: Control corner rounding
- **Button padding**: Adjust internal spacing
- **Hover effects**: Enable/disable hover animations
- **Shadow effects**: Add depth with shadows

## Custom CSS Classes

For advanced styling, use the `class` argument to apply custom CSS:

<pre>
```button
name Custom Styled Button
type command
action Toggle Pin
class my-custom-button
```
^button-custom
</pre>

### Creating Custom CSS Classes

Create a CSS snippet in `.obsidian/snippets/` folder:

**buttons-custom.css:**
```css
/* Custom button styling */
.my-custom-button {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: white;
    border: none;
    border-radius: 25px;
    padding: 12px 24px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: transform 0.3s ease;
}

.my-custom-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

/* Urgent button style */
.urgent-button {
    background: #ff4757;
    color: white;
    border: 2px solid #ff3742;
    border-radius: 8px;
    font-weight: bold;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(255, 71, 87, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
}

/* Success button style */
.success-button {
    background: #2ed573;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
}

.success-button:hover {
    background: #1e8449;
}
```

### Using Custom Classes

<pre>
```button
name Urgent Task
type command
action Toggle Pin
class urgent-button
```
^button-urgent
</pre>

<pre>
```button
name Complete Project
type command
action Toggle Pin
class success-button
```
^button-success
</pre>

## Combining Colors and Classes

You can combine built-in colors with custom classes:

<pre>
```button
name Important Action
type command
action Toggle Pin
color red
class extra-padding
```
^button-combined
</pre>

**CSS for extra padding:**
```css
.extra-padding {
    padding: 15px 30px;
    font-size: 16px;
}
```

## Theme-Responsive Styling

Create buttons that adapt to light/dark themes:

```css
/* Light theme button */
.theme-button {
    background: var(--background-secondary);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
}

/* Dark theme adjustments */
.theme.theme-dark .theme-button {
    background: var(--background-secondary-alt);
    border-color: var(--background-modifier-border-hover);
}

.theme-button:hover {
    background: var(--background-modifier-hover);
}
```

## CSS Variables Reference

Use Obsidian's CSS variables for theme consistency:

- `--background-primary`: Main background color
- `--background-secondary`: Secondary background
- `--text-normal`: Primary text color
- `--text-muted`: Muted text color
- `--text-accent`: Accent color
- `--interactive-accent`: Interactive elements
- `--background-modifier-border`: Border color
- `--background-modifier-hover`: Hover background

## Styling Tips

1. **Test in both themes**: Always check light and dark theme compatibility
2. **Use CSS variables**: Ensures compatibility with different themes
3. **Keep it readable**: Don't sacrifice legibility for style
4. **Be consistent**: Use similar styling for similar button types
5. **Performance**: Avoid complex animations on frequently-used buttons

Button styling gives you complete control over the visual presentation of your buttons, allowing you to create interfaces that perfectly match your workflow and aesthetic preferences.
