---
title: "A 35-Billion Parameter AI Runs on My Work Laptop. Here's the Trick."
description: "Cloud AI token limits forced me to rethink everything. I designed a hybrid workflow: plan with SOTA, execute locally, with a model big enough to keep up. Dense models couldn't fit. Mixture of Experts could."
authors: [DadWritesTech]
tags: [ai, llm, llama-cpp, mixture-of-experts, qwen, local-ai, moe, claude, gemma]
pubDate: 2026-05-30
---

It started with a bill. Or rather, the absence of one, because I ran out of tokens before I ran out of work.

I'd been using Claude Code at my day job. Anthropic's SOTA model, piped straight into my terminal, writing and refactoring code alongside me. It was, without exaggeration, the most productive I'd ever been. Then the usage limits kicked in. Mid-task. Mid-thought.

I tried to work around it. Smaller prompts. Tighter context windows. Pre-summarized inputs. Carefully scoped instructions that cut token consumption per interaction. It helped, for a while. But the core problem stayed put: cloud-hosted AI charges by the token, and serious work burns through tokens fast. Every planning session, every code review, every "can you restructure this module" ate into a finite daily budget. I was spending more time optimizing my AI usage than optimizing my actual code.

That's when the idea took shape.

<!-- truncate -->

## The Hybrid Thesis

What if I stopped using one model for everything?

The pattern I'd fallen into was common: reach for the best model available on every task, no matter how trivial. Ask Claude Opus to rename a variable. Ask it to scaffold a config file. Ask it to write a commit message. Each request worked. Each one also spent tokens that would've been better saved for the work that genuinely needed frontier-level reasoning.

The split became obvious once I sat with it. Some tasks need a model that can hold an entire system's architecture in its head, weigh trade-offs, and produce a coherent plan. The rest, which is most of daily work, need a model that follows clear instructions reliably. Write this function. Format this output. Apply this pattern here.

Planning and brainstorming are where SOTA cloud models earn their cost. Nothing else matches them at synthesizing messy requirements, catching architectural flaws, and turning the whole thing into a structured plan.

Execution is where local AI belongs. No token limits, no API latency, nothing leaving the machine. Just a model running on your own hardware, following the plan.

The workflow I landed on goes like this. Brainstorm and plan with Claude Opus. Distill the output into small, self-contained handoff packages: clear specifications, scoped tasks, explicit acceptance criteria. Then hand those packages to a local model for execution, with Opus reviewing the result later if needed. A senior architect drafts the blueprints, a reliable builder follows them, and the architect checks in at milestones.

The concept was sound. Finding a local model good enough to be the builder was the hard part.

## Small Models Weren't Enough

I started where most people start: small and fast. A 9B parameter model. Then 12B. Then 14B. All quantized, all running comfortably on my 8GB GPU.

For their size, they impressed me. The 14B models in particular could handle straightforward coding tasks, follow structured prompts, and produce clean output most of the time. But "most of the time" doesn't cut it when you're trying to replace a cloud model in a real workflow.

The gaps showed up in predictable places. Multi-file refactoring, where the model had to track state across several components. Tasks that needed it to infer intent from a specification rather than follow literal instructions. Code that demanded awareness of edge cases the handoff document never spelled out. None of this is exotic. It's Tuesday afternoon.

The smaller models weren't bad. They were just behind SOTA by a hard margin, the kind that turns a 10-minute task into a 30-minute debugging session because the model almost got it right but not quite. "Almost" compounds. After a week of correcting 14B output, I was sinking nearly as much time into fixing local results as I'd spent managing cloud token budgets.

I needed something north of 20 billion parameters. That seemed to be the threshold where models stop approximating competence and start showing it, where the gap between local and cloud narrows enough for the handoff workflow to function without constant supervision.

## The Candidates

The timing worked in my favor. Two major releases landed almost on top of each other.

Qwen dropped their 3.6 generation: a dense 27B model and a 35B MoE variant called 35B-A3B, with 35 billion total parameters and 3 billion active per token. Google released Gemma 4, which included a 31B dense model and a 26B-A4B MoE at 26 billion total, 4 billion active.

Four models. Two dense, two MoE, all aimed at roughly the same capability range, all in theory runnable on consumer hardware. The caveats came later.

I tried them all. The dense models hit a wall I'll get to in a moment. Both MoE models ran. They were not interchangeable.

Gemma 4 26B-A4B was fast. Noticeably fast, even next to Qwen's MoE variant. On prose, blog posts, documentation, emails, anything mostly linguistic, it produced clean, well-structured output that needed little correction. Hand it coding tasks and the accuracy slipped. Not catastrophically, but enough. Functions that compiled without handling edge cases. JSON schemas that were structurally valid and semantically wrong. The kind of error that looks fine until the tests run.

Qwen 3.6 35B-A3B was a little slower and markedly more reliable on code. It followed handoff specifications more faithfully, produced fewer logic errors, and held its consistency across multi-step technical tasks in a way the Gemma model couldn't. For coding, the primary use case in my workflow, it won outright.

So I kept both. Gemma 4 26B-A4B for prose, Qwen 3.6 35B-A3B for code. Two models, two strengths, one laptop.

Getting either to run took solving a hardware problem first.

## The VRAM Wall

Before the MoE models, I spent several days trying to run the dense alternatives. Qwen3.6-27B. Gemma 4 31B. Both are strong models. Neither would fit on my GPU.

My machine is a Dell Precision 5770: i7-12700H, 32GB of DDR5 RAM, and an NVIDIA RTX A2000 with 8GB of GDDR6. A solid workstation, not a deep learning rig.

Dense transformer models carry a structural constraint that doesn't bend. Every parameter participates in every forward pass. Feed a token into a 27B dense model and all 27 billion parameters activate. Every one of them has to be resident in memory for inference to run at any usable speed.

At FP16 precision, 27 billion parameters occupy roughly 54GB. Quantize aggressively to Q4_K_M and you're still looking at 16 to 18GB. My GPU has 8. You can offload layers to system RAM, but then you're shuttling data across the PCIe bus for every token, and inference speed collapses to 1 to 2 tokens per second. That isn't a workflow. It's a slideshow.

I tried different quantization levels, different context lengths, different layer-splitting ratios. The dense architecture doesn't negotiate. It either fits or it doesn't.

It didn't.

## The Architecture That Bends

Mixture of Experts changes the math because it changes what "running a model" actually means at the hardware level.

In a dense model, every layer sits in the critical path. There's no such thing as an optional weight. An MoE model splits the feedforward layers into multiple "expert" sub-networks, and a lightweight router decides, per token, which experts are relevant. Only the selected experts activate. The rest sit idle.

Qwen 3.6 35B-A3B carries 35 billion parameters in total, but the "A3B" means only about 3 billion fire per token. The other 32 billion live in the model's weights and feed its breadth of knowledge, yet they draw no GPU compute unless the router specifically calls on them.

Those inactive experts don't need to live on the GPU. They can sit in system RAM.

This is where llama.cpp's `-ncmoe` flag earns its place. It offloads the non-critical MoE layers, the experts the router skips for a given token, to the CPU. The active pathway and the attention layers stay on the GPU. The critical path stays fast. Everything else stays reachable but out of the way.

With a dense model, offloading wrecks performance because every layer is critical. With MoE, most layers are cold on any given token, and offloading cold layers costs almost nothing. That's the trick. The whole trick.

## The Setup

No containers. No orchestration frameworks. No cloud endpoints.

**Hardware:**
- Dell Precision 5770
- Intel i7-12700H (14 cores, 20 threads)
- 32GB DDR5 RAM
- NVIDIA RTX A2000 Laptop GPU (8GB GDDR6)

**Software:**
- llama.cpp (built from source, CUDA-enabled)
- Qwen3.6-35B-A3B (Q4_K_M quantization, GGUF format)

**The command:**

```bash
.\llama-server.exe ^
  -m "G:\work\MTP\models\Qwen3.6-35B-A3B-UD-Q4_K_XL.gguf" ^
  --spec-type draft-mtp --spec-draft-n-max 2 ^
  -ngl 999 -ncmoe 37 ^
  -c 50000 ^
  --reasoning off ^
  --host 127.0.0.1 --port 1234 ^
  -ctk q8_0 -ctv q4_0 ^
  --no-mmap -fa on
```

That's a lot of flags. Each one matters.

`-ngl 999` pushes every possible layer to the GPU. The number runs intentionally higher than the actual layer count, so llama.cpp offloads everything it can without needing to know the exact architecture depth. `-ncmoe 37` is the MoE offloading flag. It pushes 37 non-critical expert layers to the CPU and keeps only the active expert pathways and attention layers on the GPU, where speed matters.

`--spec-type draft-mtp --spec-draft-n-max 2` turns on speculative decoding using Multi-Token Prediction. Rather than generating one token at a time, the model drafts two tokens ahead speculatively and verifies them in a single forward pass. When the guess is right, and for predictable sequences it often is, you get close to double the throughput for free. When it's wrong, you've lost almost nothing. It's one of those optimizations that sounds like it shouldn't work as well as it does.

`-c 50000` sets a 50,000-token context window. Large enough to hold an entire handoff specification, a full codebase file, and a multi-turn conversation without truncation.

The reason all of this fits on 8GB of VRAM is the next pair of flags. `-ctk q8_0 -ctv q4_0` quantizes the KV cache itself, keys stored at Q8 precision and values at Q4. Without KV cache quantization, a 50K context window would blow past the VRAM budget on its own. With it, the cache compresses to a fraction of its full-precision size. You lose a little marginal precision in attention scores. In practice, I haven't noticed a quality difference.

> The asymmetry is deliberate. Keys and values play different roles in the attention mechanism, and they don't degrade equally under quantization.
>
> Keys compute attention scores. The dot product between queries and keys decides *which tokens the model pays attention to*. Small numerical errors in keys can shift that distribution, changing which parts of the context the model focuses on for a given token. The effect cascades. A slightly wrong attention pattern means slightly wrong output, compounding across layers. Keys need to stay precise.
>
> Values get weighted and summed *after* the attention pattern is already decided. Once the model knows where to look, values are just combined linearly according to those weights. Quantization errors in values average out across the weighted sum. They're noise in a signal that's already been filtered, so the tolerance for imprecision runs substantially higher.
>
> So keys get Q8, enough precision to keep attention scores accurate, and values get Q4, half the memory with errors that effectively vanish in the aggregation. The payoff is a 50K context window that fits in VRAM where a naively stored cache wouldn't, with no quality loss I can perceive.

`-fa on` enables flash attention, a more memory-efficient attention computation that cuts the overhead of long-context inference.

`--no-mmap` disables memory-mapped file I/O and loads the model weights straight into RAM, which avoids page-fault latency during inference.

`--reasoning off` shuts off the model's built-in chain-of-thought mode. For execution tasks, where I've already done the reasoning in the handoff spec, I don't need the model thinking out loud. I need it doing.

No Ollama. No Python wrappers. No abstraction layers. A compiled binary talking directly to the hardware.

## The Numbers

No synthetic benchmarks, no cherry-picked prompts. These are consistent observations from real daily use: enterprise documentation queries, code generation from handoff specs, structured output tasks.

| Metric | Qwen 3.6 35B-A3B | Gemma 4 26B-A4B |
|---|---|---|
| Quantization | Q4_K_M | Q4_K_M |
| VRAM usage | ~7.2GB / 8GB | ~6.8GB / 8GB |
| System RAM usage | ~14GB / 32GB | ~11GB / 32GB |
| Tokens/sec (generation) | ~18 t/s | ~22 t/s |
| Context window | 4096 tokens | 4096 tokens |
| Time to first token | ~1.2s | ~0.9s |
| Coding accuracy | Strong | Moderate |
| Prose quality | Good | Strong |

Eighteen tokens per second on Qwen, twenty-two on Gemma. Both genuinely usable. Both running on a laptop GPU that costs a fraction of what people assume you need for "real" AI inference.

## The Full Pipeline

Here's what a typical workday looks like now.

I open a task, say building a new API endpoint for an internal tool. I start with Claude Opus. I describe the requirements, the constraints, the existing codebase structure. Opus produces a plan: file structure, function signatures, data flow, edge cases to handle, test scenarios. This is the planning phase. It costs tokens, and it's worth every one, because this is where frontier-model reasoning actually earns its keep.

I take that plan and distill it into a handoff package: a Markdown file with clear sections for objective, specifications, file-by-file instructions, acceptance criteria. No ambiguity, no room for interpretation. The kind of document a competent junior developer could follow without asking questions.

Then I feed the handoff to Qwen 3.6 35B-A3B running locally. It executes. Writes the code, follows the spec, produces output. No token meter ticking, no API call, nothing leaving my machine. If I need to iterate, say "change the error handling pattern," I just ask again. And again. It costs nothing.

When the task needs documentation for what was built, I switch to Gemma 4 26B-A4B. Better prose, smoother phrasing, more natural paragraph flow. Same hardware, different model binary, different strength.

At the end, if the task was complex enough to warrant it, I send the finished output back to Opus for review. A final check from the architect, the senior engineer glancing over the builder's work.

Planning runs on cloud SOTA. Execution runs on local MoE. Review goes back to cloud SOTA. The expensive models do what only they can do, and the local models handle everything else. My token usage dropped by roughly 70%. Productivity didn't drop at all.

## The Uncomfortable Question

If a technical writer with a work laptop and an 8GB GPU can run this, planning with frontier AI and executing with a local 35-billion parameter model, switching between specialized models for different tasks, then what exactly is the barrier to enterprise adoption?

It isn't hardware. A mid-range workstation with 16GB of VRAM could run these models with headroom, and most engineering teams already have machines like that sitting under desks.

It isn't software either. llama.cpp is open source, compiles on nearly anything, and ships updates weekly. The GGUF format is becoming a standard, and the quantization tooling is mature.

It isn't model availability. Qwen, Gemma, Llama, Mistral, Phi: a capable open-weight model lands almost every month. The gap between open and proprietary narrows with each release, and for scoped execution tasks it has already closed.

The real barrier is an assumption. The belief that AI requires a platform team, a cloud contract, and a six-month implementation plan. It doesn't, at least not for every use case. Sometimes it takes a compiled binary, two model files, and someone willing to rethink the workflow instead of just scaling the budget.

## What I Learned

I started this because Claude Code's token limits forced me to. That's the honest version. Not curiosity. Not ideology. Frustration.

The constraint produced something better than what I had before. The hybrid workflow, plan with SOTA, execute locally, review with SOTA, isn't a compromise. It's a separation of concerns. The same principle that makes good software architecture makes good AI workflows: put each component where it performs best, and don't ask it to do everything.

The dense 27B model was a dead end on my hardware. That failure pushed me to understand MoE architecture, which led me to a model that's technically larger, 35 billion parameters, running faster than the 27B ever could have on the same machine.

The trick wasn't more hardware. It was a different architecture, and the willingness to read the documentation instead of throwing flags at a command line until something worked.

When brute force fails, the answer is usually structural rather than incremental. That applies to a lot more than AI inference.

---

*Bhaskar Dontaraju is a Technical Writer and AI Solutions Developer based in Munich, Germany. He writes about AI, documentation, and the things that break along the way at [dad-writes-tech.com](https://www.dad-writes-tech.com).*
