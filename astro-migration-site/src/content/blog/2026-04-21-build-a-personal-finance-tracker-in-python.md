---
slug: build-personal-finance-tracker-python
title: "I Built a Personal Finance Tracker in Python — Here's How"
pubDate: 2026-04-21T20:00:00+02:00
description: "Skip the spreadsheets. I built a zero-dependency CLI personal finance tracker in Python from scratch — complete with validation, tests, and documentation."
authors: [DadWritesTech]
tags: ["pythonguide", "cli", "tutorial", "productivity"]
---

If you're like me, you've tried every finance app on the market and ended up going back to a messy Excel sheet. They either feel like overkill for tracking a few categories or they want to link your bank account just so you can see what you spent on coffee last Tuesday.

So I did what any self-respecting engineer would do: I built my own.

This is a **zero-dependency Python CLI tool** that lets you track income and expenses from the terminal. No database setup. No config files. No accounts. Just `python -m finance_tracker add income 5000 Salary --date 2026-04-01` and you're done.

<!--truncate-->

## Why a CLI Tool?

Before you roll your eyes — hear me out.

The terminal is where I live. I don't want to open a browser, log into another service, and fill out forms. I want to type a command and be done. That's it.

Plus, as engineers, we all know that the best tools are the ones you build yourself. Sure, they take longer. But you get exactly what you want, and more importantly, you learn a thing or two along the way.

This project uses **only the Python standard library**. No `pip install` required. Here's what went into it.

## The Architecture

I broke the project into five modules, each with a single responsibility:

| Module | Purpose |
|--------|---------|
| `models.py` | Transaction dataclass with validation |
| `storage.py` | JSON-based persistence layer |
| `commands.py` | Business logic for add/list/summary |
| `cli.py` | Argument parsing with `argparse` |
| `__main__.py` | Module entry point |

This separation keeps things clean. The models don't know about the CLI. The storage doesn't know about validation. Each piece does one thing well.

## The Transaction Model

At the heart of the tracker is the `Transaction` dataclass:

```python
from dataclasses import dataclass, field
from datetime import date

@dataclass
class Transaction:
    type: str
    category: str
    amount: float
    date: date = field(default_factory=date.today)
    description: str = ""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])

    def __post_init__(self) -> None:
        if self.type not in ("income", "expense"):
            raise ValueError("Type must be 'income' or 'expense'")
        if self.amount <= 0:
            raise ValueError("Amount must be positive")
        if not self.category.strip():
            raise ValueError("Category cannot be empty")
```

The `__post_init__` method runs automatic validation — no transaction with a negative amount or empty category can exist. It's a small thing, but it means the data is always clean.

Each transaction gets an auto-generated 8-character ID. Not that you need to know it — but it's there if you ever want to query the raw JSON file.

## Persistent Storage (No Database Required)

I wanted something dead-simple. No SQLite, no PostgreSQL, no cloud sync. Just a JSON file.

The `Storage` class handles everything:

```python
class Storage:
    def __init__(self, filepath: Optional[Path] = None) -> None:
        if filepath is None:
            filepath = Path.home() / ".finance_tracker" / "transactions.json"
        self.filepath = Path(filepath)
        self._ensure_storage_exists()
```

By default, transactions live at `~/.finance_tracker/transactions.json`. You can override it with `--storage /path/to/file.json` if you want something portable.

The JSON structure is straightforward — just an array of transaction objects:

```json
[
  {
    "id": "91c3736f",
    "date": "2026-04-01",
    "type": "income",
    "category": "Salary",
    "amount": 5000.00,
    "description": "Monthly salary"
  }
]
```

If you ever want to back it up, share it, or inspect it, you can just open it in any text editor.

## The CLI

I used Python's built-in `argparse` to build a clean interface with subcommands:

```
python -m finance_tracker --help

usage: finance_tracker [-h] [--storage STORAGE] {add,list,summary} ...

Personal Finance Tracker
```

Three subcommands, that's all you need:

### `add` — Record a transaction

```bash
python -m finance_tracker add income 5000 Salary \
    --date 2026-04-01 --description "Monthly salary"

Transaction added successfully!
  ID:       91c3736f
  Date:     2026-04-01
  Type:     income
  Category: Salary
  Amount:   $5000.00
  Description: Monthly salary
```

### `list` — View your transactions

```bash
python -m finance_tracker list

Date         Type     Category            Amount  Description
----------------------------------------------------------------------
[2026-04-21] EXPENSE | Food              -25.50  Lunch
[2026-04-01] INCOME  | Salary           +5000.00  Monthly salary
----------------------------------------------------------------------
Total Income:      $5000.00
Total Expenses:    $   25.50
Balance:           $4974.50
```

Filter by type or category, and set a limit on results.

### `summary` — Get the big picture

```bash
python -m finance_tracker summary

=== Financial Summary ===
Total Income:    $   5000.00
Total Expenses:  $     25.50
Balance:         $   4974.50
Transactions:    2
=========================
```

## Testing — Because "It Works on My Machine" Doesn't Cut It

I wrote **29 unit tests** covering every critical path:

- Transaction model validation (invalid types, negative amounts, empty categories)
- Serialization roundtrip (`to_dict` / `from_dict`)
- Add command with various inputs
- Storage layer load/save/filter operations
- Summary calculations

All tests pass with flying colors:

```
Ran 29 tests in 0.044s
OK
```

I used the built-in `unittest` framework — no external test dependencies needed. That's the beauty of this project: everything runs on the standard library, including the test suite.

## How to Run It

```bash
# Add an income transaction
python -m finance_tracker add income 5000 Salary --date 2026-04-01

# Add an expense (date defaults to today)
python -m finance_tracker add expense 25.50 Food --description "Lunch"

# List all transactions
python -m finance_tracker list

# Show summary
python -m finance_tracker summary
```

The full project is available as a ZIP download below. Just extract it and run `python -m finance_tracker` from the folder. No installation, no setup, no nonsense.

## What's Next?

This is version 1.0 — a solid foundation. Some ideas for future versions:

- **Export to CSV** for those spreadsheet loyalists
- **Monthly budget categories** with spending alerts
- **Recurring transaction templates** (salary, rent, subscriptions)
- **Multiple accounts** (cash, card, savings)

But you know what? It's already useful. I've been using it for my own tracking, and it does exactly what I need: record money in, record money out, see what's left.

## Download

<a href="/downloads/personal_finance_tracker.zip" download class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
  Download personal_finance_tracker.zip
</a>

The ZIP contains the full source code, tests, and README. Extract it anywhere and start tracking.

---

Have questions or ideas? Drop me a message. And if you build something cool on top of it, let me know — I'd love to see what you do with it.