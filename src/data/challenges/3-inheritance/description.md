---
id: '3'
title: 'Inheritance'
difficulty: 'Medium'
---

## Description

In this challenge, you will practice inheritance in object-oriented programming. A child class can inherit attributes and methods from a parent class, which helps with code reuse and logical hierarchy.


## Requirements

- Create a base class named `Animal` with a `speak()` method
- Create a `Dog` class that inherits from `Animal`
- Override `speak()` in `Dog` to return `Woof!`
- Create a `Cat` class that inherits from `Animal`
- Override `speak()` in `Cat` to return `Meow!`

## Example

```python
dog = Dog()
cat = Cat()
print(dog.speak())  # Output: Woof!
print(cat.speak())  # Output: Meow!
```



