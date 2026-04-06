---
id: '4'
title: 'Create a Simple Bank Account Class'
difficulty: 'Easy'
---

## Description

In this challenge, you will implement a basic `BankAccount` class that demonstrates foundational object-oriented programming concepts in Python.

## Requirements

- Create a class named `BankAccount`
- Implement an `__init__` method that accepts `owner` and `balance` parameters
- Add a `deposit(amount)` method to add funds
- Add a `withdraw(amount)` method and check for sufficient balance
- Add a `get_balance()` method to return the current balance

## Example

```python
account = BankAccount("Alice", 1000)
account.deposit(500)
account.withdraw(200)
print(account.get_balance())  # Output: 1300
```



