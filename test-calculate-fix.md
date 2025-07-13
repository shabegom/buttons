# Test Calculate Button Fix

This test demonstrates that the calculate button now properly displays "Result: 0" when the calculation result is 0.

## Test Case 1: Basic subtraction that results in 0

Bananas held: 5
Bananas lost: 5

```button
name How many bananas do I have?
type calculate
action $1-$2
color yellow
```
^button-bananas-test

Expected result: When clicked, should display "Result: 0"

## Test Case 2: Simple calculation that results in 0

```button
name Zero Test
type calculate
action 1-1
color blue
```
^button-zero-test

Expected result: When clicked, should display "Result: 0"

## Test Case 3: Multiplication that results in 0

```button
name Multiply by Zero
type calculate
action 5*0
color red
```
^button-multiply-zero

Expected result: When clicked, should display "Result: 0"

## Test Case 4: Positive result (should still work)

```button
name Add Two Numbers
type calculate
action 2+3
color green
```
^button-add-test

Expected result: When clicked, should display "Result: 5" 