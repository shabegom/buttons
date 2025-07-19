---
title: Calculate Buttons
date: 2024-07-19T00:00:00.000Z
permalink: usage/types/calculate.html
eleventyNavigation:
  order: 6
  key: calculate
  parent: types
  title: Calculate
---

**Calculate Buttons** let you perform mathematical operations and display the results directly in your note. You can do simple math, reference numbers from other lines in your note, or even use natural language math expressions.

## Simple Math

Do basic calculations with a Calculate Button:

<pre>
```button
name Add Em Up
type calculate
action 2+2
```
^button-add
</pre>

When clicked, this button will replace itself with the result: `4`

## Referencing Line Numbers

Calculate Buttons can reference numbers from specific lines in your note using the `$line` syntax:

<pre>
Bananas Have: 5  
Bananas Lost: 3

```button
name How Many Bananas Left?
type calculate
action $1-$2
color yellow
```
^button-bananas
</pre>

The `$1` references the number on line 1 (5), and `$2` references the number on line 2 (3). The result will be `2`.

## Natural Language Math

Calculate Buttons can understand natural language math expressions:

<pre>
5 dogs plus 2 cats divided by 2 people

```button
name Who Gets The Pets?
type calculate
action $1
class pet-button
```
^button-pets
</pre>

This will evaluate the natural language math on line 1 and return `3.5`.

## Advanced Math Examples

### Budget Calculator
<pre>
Income: 3000
Rent: 1200  
Groceries: 400
Utilities: 200

```button
name Calculate Remaining Budget
type calculate
action $1-$2-$3-$4
color green
```
^button-budget
</pre>

### Percentage Calculator
<pre>
Total Points: 850
Points Earned: 765

```button
name Calculate Grade Percentage
type calculate  
action ($2/$1)*100
color blue
```
^button-grade
</pre>

### Time Calculation
<pre>
Start Time: 9.5
End Time: 17.25

```button
name Hours Worked
type calculate
action $2-$1
```
^button-hours
</pre>

## Supported Mathematical Operations

Calculate Buttons use the [math-expression-evaluator](https://github.com/bugwheels94/math-expression-evaluator) library, supporting:

- **Basic operations**: `+`, `-`, `*`, `/`
- **Parentheses**: `(2 + 3) * 4`
- **Exponents**: `2^3` or `2**3`
- **Square root**: `sqrt(16)`
- **Absolute value**: `abs(-5)`
- **Trigonometric functions**: `sin()`, `cos()`, `tan()`
- **Logarithms**: `log()`, `ln()`
- **Constants**: `pi`, `e`

### Complex Calculation Example
<pre>
Radius: 5

```button
name Calculate Circle Area
type calculate
action pi * ($1^2)
```
^button-circle-area
</pre>

## Line Reference Tips

1. **Line counting**: Lines are counted from the top of the note, starting with 1
2. **Multiple numbers**: If a line has multiple numbers, it uses the first one
3. **Decimal numbers**: Both integers and decimals work fine
4. **Empty lines**: Empty lines still count in the line numbering
5. **Non-numeric lines**: Lines without numbers are treated as 0

### Example with Mixed Content
<pre>
Project Budget Analysis
Total: 5000
Spent on marketing: 1500
Remaining for development: unknown

```button
name Calculate Development Budget
type calculate
action $2-$3
```
^button-dev-budget
</pre>

## Styling Calculate Buttons

You can style Calculate Buttons just like any other button:

<pre>
```button
name Calculate Total
type calculate
action 100+200+300
color purple
class math-button
```
^button-styled-calc
</pre>

## Common Use Cases

- **Budget tracking**: Calculate remaining funds, percentages
- **Grade calculations**: GPA, test score averages
- **Time tracking**: Hours worked, project duration
- **Unit conversions**: Using conversion factors
- **Statistics**: Simple averages, sums, differences
- **Project planning**: Resource allocation, timeline calculations

Calculate Buttons are perfect for any scenario where you need quick mathematical results embedded directly in your notes. They're especially useful in dashboards, project notes, and any document where you're tracking numerical data.