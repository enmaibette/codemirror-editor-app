# Challenge Content Structure

Each challenge lives in its own folder.

Required files per challenge:
- `description.md`
- `hints.md`
- `exampleCode/*.py` (first file is the starter code for now; more files can be added later)
- `testcases/testcase.json`

`description.md` format:

```md
---
id: '1'
title: 'Create a Class - Dog'
difficulty: 'Easy'
hasDiagram: false
---

## Description
...

## Requirements
- Requirement text

## Example
```python
print('hello')
```
```

`testcases/testcase.json` format:

```json
[
  {
	"id": "tc1",
	"title": "Test Case 1",
	"expected": "...",
	"got": "—",
	"status": "pending"
  }
]
```

The runtime aggregator is `src/data/challenges/index.ts`.






