---
title: "I Told an AI to Build Me a Pokémon Game. It Did."
description: "Zero code written by me. A fully playable browser RPG with 8 gyms, a full region, randomized starter selection, real battle mechanics, and a Docker deployment — all from natural language prompts to Claude Code."
pubDate: 2026-06-14T15:00:00+02:00
tags: ["ai", "gaming", "claudecode", "tutorial", "agentic-ai"]
---

I've been a casual gamer my whole life. I've also been a dad who talks about tech for a living. So when I heard people say AI coding assistants could "build anything," I figured I'd test that claim in the most ridiculous way I could think of.

I told it to build me a Pokémon game.

Not a demo. Not a proof-of-concept clone. A real, playable RPG — with its own region, gym leaders, wild encounters, a starter selection screen, a working economy, and a battle engine. The kind of game that takes a team of developers months to build.

I wrote zero lines of code myself. Here's what happened.

<!-- truncate -->

## The Setup

The tool I used is called **Claude Code** — Anthropic's agentic coding assistant. It's not a chatbot in the traditional sense. It doesn't just answer questions. It reads your files, writes code, runs commands, debugs errors, and iterates — autonomously — based on what you tell it in plain English.

I gave it a one-liner: *"make a Pokémon-style browser RPG."*

Then I just kept talking.

---

## What It Built

The final game — called **The Mosaic** — is a fully playable browser-based Pokémon RPG. Here's what that actually means in practice:

**A real battle engine.** Under the hood, every fight runs on **Pokémon Showdown** — the same battle simulator used by millions of competitive players. Accurate damage calculations, type matchups, status effects, switching mechanics, all 1025+ Pokémon with their actual moves and stats. I didn't implement any of that. The AI figured out how to wrap it.

**A full 8-gym region.** Fourteen interconnected maps stretching from Verdant Hollow all the way to Shadowmere — towns, routes, biome-themed wild encounters, Pokémon Centers, shops, and NPC trainers on every route. The maps are big. Route 1 alone has tall grass patches spanning the whole thing.

**Randomized starter selection.** Every new game is different. The server picks three random Pokémon from a pool of 37 three-stage evolution lines and guarantees they don't share a type. You get a slick animated UI to choose between them. This was a one-sentence request: *"every game should be unique, have any 3 Pokémon with 3 evolution stages."*

**An adaptive AI opponent.** Gym leaders and trainers use a custom decision brain that scales to your progress. Early gyms make cautious plays. Later gym leaders are aggressive, draft type-counter teams, and punish you for bad switches.

**A full save system.** PostgreSQL-backed saves with Docker Compose deployment. You can continue from the title screen, save anywhere, and it all persists.

**A title screen, Pokédex, Trainer Card, Region Map, Shop UI.** Premium-looking screens, dark glassmorphism aesthetic, animated particle effects. These were all built in a single session from nothing.

---

## How the Conversation Actually Went

This is the part that I think is important to understand. I wasn't typing code prompts. I was having a conversation.

Some of my actual inputs:

- *"sprites dead on docker"*
- *"i notice when entering maps, player is entering random places"*
- *"some are not visible, also ensure not same type in 3"* (with a screenshot)
- *"starter comes at level 5, route 1 is really hard"*
- *"create full game and story and maps.. routes.. make big routes"*

That's it. That's the prompting. The AI read the error logs, found the root cause (Nginx wasn't serving the sprites-master folder), fixed the Docker config, and rebuilt the container — without me asking it to do any of those individual steps.

The type overlap fix — where it checked for duplicate types before showing starters — it did by querying the Pokémon Showdown data layer directly. I said "no same type" and it figured out *how* to enforce that from the existing codebase.

---

## What This Actually Means

I want to be honest about something: this isn't the future of gaming. Professional game developers have nothing to fear from a single dad prompting an AI on a Saturday.

But here's what it *does* mean.

The gap between "I have an idea" and "there's a working thing on my screen" has collapsed in a way I didn't fully believe until I lived it. The conversation I had with Claude Code over a single session produced something I genuinely play. My kids play it. It has bugs. Some screens have rough edges. The overworld movement could be smoother.

But it works. And I didn't know TypeScript three months ago.

The skill that matters now isn't knowing how to write a database query or configure an Nginx reverse proxy. It's knowing what you want clearly enough to describe it. That's a different kind of literacy — and it's one that anyone can build.

---

## The Stack (Since You'll Ask)

For the curious:

| Layer | Tech |
|---|---|
| Battle engine | Pokémon Showdown (via Node.js) |
| Backend | Node.js + Express + TypeScript |
| Frontend | Vanilla TypeScript + Vite (no framework) |
| Database | PostgreSQL 15 |
| Deployment | Docker Compose + Nginx |
| Sprites | PokeAPI sprite repository |
| 3D assets | KayKit Adventurers + Kenney Fantasy Town Kit (CC0) |

The whole thing runs on `docker-compose up --build` and opens in a browser on `localhost:8080`. No installation, no setup, no accounts.

---

## Try It Yourself

The source code is on GitHub: **[github.com/dadwritestech/the-mosaic](https://github.com/dadwritestech/the-mosaic)**

Clone it, run Docker, and pick your starter. The three you get will be completely different from mine.

This is v1. There's a lot more I want to add — proper sound effects, move animations, a full Elite Four sequence, mobile controls. But that's the thing about building this way: the gap between "I want that" and "it exists" keeps getting shorter.

---

*Pokémon and all related names are trademarks of Nintendo, Game Freak, and The Pokémon Company. This is a non-commercial fan project built for educational purposes.*
