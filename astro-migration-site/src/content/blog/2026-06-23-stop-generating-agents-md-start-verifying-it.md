---
title: "Stop Generating AGENTS.md. Start Verifying It."
description: "AI coding agents read an AGENTS.md to learn your project. Most of those files are confident guesses that quietly rot. The fix isn't a better generator. It's proof."
pubDate: 2026-06-23
authors: [DadWritesTech]
tags: [ai, agents, automation, documentation]
slug: stop-generating-agents-md-start-verifying-it
---

A documentation file that is wrong is worse than no file at all. I've made that argument for years about the docs humans read. The same rule now governs the files we write for machines, and most teams are breaking it on purpose.

Every serious AI coding tool reads a context file. Call it `AGENTS.md`, `CLAUDE.md`, or a `.cursorrules`, the job is the same: tell the agent how your project actually works. The test command. The build step. Which package manager. The one migration you never run on a Friday. Useful, in theory. In practice it's the most neglected file in the repository. Someone writes it the week the project starts. The build command changes four months later. Nobody touches the file. The agent reads it and runs the wrong thing with total confidence.

Stale instructions don't fail loudly. They mislead quietly. That's the expensive kind.

<!-- truncate -->

## Why the file goes wrong

An AI agent has no memory of your repository. Open a fresh session and it starts cold, guessing at the basics it can't see: is it `npm test` or `pytest`, is this pnpm or yarn, where does the build output land. It tries one, gets it wrong, pokes around your files, tries again. Several wasted turns, every session, on questions the last session already answered and then forgot.

`AGENTS.md` was supposed to end that. A fix that decays is just a slower failure, though. Documentation rot is an old story. We've watched READMEs lie for twenty years. What changed is the reader. A person skims a stale README and senses something is off; the prose smells wrong, the version looks ancient, instinct kicks in. An agent has no such instinct. It treats the file as ground truth and acts on it immediately. The rot didn't get worse. The consequences did.

## Generated is the worst kind of wrong

The industry's reflex is to generate the file. There are web tools, git hooks, and "scan your repo and answer twenty questions" assistants, and nearly all of them work the same way underneath. Point a language model at the project, let it infer your commands, commit whatever it produces. I understand the appeal. I also think it's a mistake, and there's data that agrees.

Researchers at ETH Zurich measured what happens when you hand agents machine-generated context files. Task success dropped by roughly three percent. Token cost climbed past twenty. The model burned extra reasoning steps digging itself out of context that pointed the wrong way. Hand-curated files did slightly better than nothing. Generated-and-unverified did worse than nothing.

Read that again, because it inverts the convenient assumption. The easy option is the one that hurts. A generated file is a confident guess wearing the costume of a fact, and the agent on the other end cannot tell the difference. You didn't give it knowledge. You gave it a plausible lie, formatted as authority, committed to main.

## Verification is a documentation principle, not a feature

Here's where I plant the flag. Good documentation earns trust through provenance. A claim is only as good as the evidence behind it, and for operational docs that evidence already exists in a perfect form: the command itself. Every instruction in an `AGENTS.md` should answer one question. What command proves this is true, and did it pass?

If the answer is "we ran it, it exited clean, here's when," you have documentation worth committing. If the answer is "a model thought this was probably right," you have a liability with nice formatting. This isn't a new idea. It's the oldest discipline in technical writing, pointed at a new audience that happens to execute everything you tell it.

So I stopped theorizing and built the thing I wanted.

## What I built, and what it refuses to do

It's called warmstart, and it's one command:

```bash
npx warmstart init
```

It reads your project the boring, deterministic way. No model guessing. It pulls candidate commands from `package.json` scripts, `Makefile` targets, and `pyproject.toml`, and works out your package manager from the lockfile. Then it shows you the exact plan and asks before it does anything.

The part that matters is what comes next. It runs the commands. Install, build, lint, test, whatever it found, in dependency order, and it records what actually happened. A command that passes gets written down. A command it can't verify gets labeled as such, honestly, instead of being dressed up as working.

It is also deliberately cowardly about danger, which is the correct posture for a tool that runs your code. Anything that looks destructive, a `deploy`, an `rm -rf`, a `git push`, a database drop, gets listed and never executed. Nothing touches a shell, so there's no injection surface. Output is scrubbed for tokens and credentials before a single line is written, because a context file is committed to the repo and secrets have a nasty habit of riding along in logs.

## The honest stamp

Every command warmstart writes carries a stamp that states exactly what was proven, where, and when:

```markdown
<!-- warmstart:start -->
## test
- `npm run test` — ✓ passed — linux/x64, node 22, 2026-06-23
<!-- warmstart:end -->
```

That stamp is the whole philosophy in one line. It does not say "verified," because "verified" is a marketing word with no edges. It says this ran here, on this platform, on this day. Not a promise about your laptop. Not a guarantee about next month. A fact with a date on it. If the command later breaks, you re-run warmstart and the stamp tells the truth again. The file stays honest because honesty is the only thing it's allowed to write.

It also serves the same data over MCP, so an agent can query the verified commands directly instead of parsing prose. Same facts, two doors.

## It won't touch your prose

The objection I expected first was the one about ownership. You already wrote an `AGENTS.md`, full of architecture notes and hard-won gotchas, and no tool is welcome to bulldoze it. Agreed. warmstart backs up an existing file, then appends its block between two markers and leaves everything else alone. Run it again and it updates only its own section, so nothing stacks up into duplicates. Your words stay yours. The machine-verified commands live below, refreshed on demand. Curated knowledge on top, proven facts underneath, neither stepping on the other.

## Where I land

Treat your agent's context file the way you'd treat any document with consequences. Give it provenance or don't commit it. The tooling around AI coding is racing to generate more text faster, and I think that's exactly backwards. We don't have a shortage of plausible instructions. We have a shortage of true ones.

Generate nothing. Verify everything you write down. If a command can't pass on demand, it doesn't belong in a file your agent will obey without question.

warmstart is open source and MIT-licensed, if you want to point it at a repo and watch it earn its claims: [github.com/dadwritestech/warmstart](https://github.com/dadwritestech/warmstart).
