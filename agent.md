# Agent Notes - Frontier Hackathon

Дата анализа: 2026-05-02.

## Что найдено

- Main hackathon: Solana Frontier by Colosseum.
- Main period: 2026-04-06 06:00 PT to 2026-05-11 23:59 PT.
- Registration cutoff: 2026-05-04 23:59 PT.
- Main winner announcement target: by 2026-06-23.
- Superteam Earn Frontier page has 52 sidetracks with about 417,915 nominal prize/credit value.
- Superteam sidetracks must be submitted separately. A project can be submitted to multiple sidetracks if it fits each sponsor's requirements.
- Superteam listing endpoint used: https://superteam.fun/api/hackathon/frontier

## Critical eligibility risk

Official rules exclude persons located or ordinarily resident in Russia, Crimea/Sevastopol, Donetsk, Luhansk, Zaporizhzhia, Kherson, and other sanctioned/restricted regions. Before planning submissions, confirm the actual residence/location/status of every team member. If a participant is in an excluded location, main Colosseum eligibility can fail, and most sidetracks require main Colosseum eligibility.

## Probability method

Naive % = prize spots / (visible current submissions + 1), capped at 100%.

This is only a competition-density indicator, not true win probability. For regional tracks, if the team is not eligible for that region, effective probability is 0%.

## Best multi-track direction without proposing a product idea

Do not propose specific product ideas yet. The best overlap is a single serious Solana product with credible:

- main Colosseum submission quality;
- public repo and strong README;
- demo video and pitch deck;
- security docs;
- meaningful sponsor integrations, not superficial API calls;
- payments/stablecoin/privacy/data/identity/incentive/onchain-agent coverage only where the product naturally supports it.

## Recommended target stack

Primary non-regional targets:

- Main Frontier
- 100xDevs - 36%
- Adevar Labs - 42%
- RPC Fast - 40%
- Tether QVAC - 60%
- Encrypt/Ika - 56%
- Cloak - 38%
- Umbra - 27%
- Palm USD - 33%
- Dune SIM - 33%
- GoldRush/Covalent - 33%
- LPAgent - 67%
- Torque - 50%
- SNS Identity - 100% current density, but check Malaysia/Network State wording
- MagicBlock Privacy - 20%
- Zerion Global - 25%
- theMiracle - 100%, but reward is wallet placement value

Lower-priority or separate-artifact targets:

- Jupiter - 4%, very crowded.
- Eitherway - 21%, requires live dApp built/deployed through Eitherway.
- SagaPad - 60%, separate skill marketplace artifact.
- dum.fun - 29%, separate devnet token launch/feedback activity.

Regional targets:

- Add only if the team can truthfully claim the region or meaningful connection.
- Regional tracks with very low current visible competition include Nepal, Canada, Turkey, Japan, Brazil, Balkan, Spain, Ireland, Georgia, Singapore, UAE, Germany, Malaysia/Network State, Korea, Netherlands, Pakistan, Kazakhstan, and first-time builder tracks.

## Practical recommendation

Best path is not "submit to all 52". Best path is:

1. Build for main Colosseum quality first.
2. Add 8-12 global sidetracks whose integrations are natural.
3. Add any truthful regional track.
4. Avoid forced integrations that make the product look unfocused.

## Files

- Full research and table: documentation.md
- This operational summary: agent.md
- VeilSettle implementation plan: docs/superpowers/plans/2026-05-02-veilsettle-mvp.md

## Copilot project-history analysis - 2026-05-02

Source: Colosseum Copilot skill v1.2.1. Scope checked across Renaissance 2024, Radar 2024, Breakout 2025, Cypherpunk 2025. Corpus slice: 5,428 projects, 293 winners.

### What repeats most often

Common project ideas across the corpus:

- AI agents for Solana: 325 projects in "Solana AI Agent Infrastructure"; 270 in "AI-Powered Solana DeFi Assistants".
- DEX/trading infrastructure: 323 projects.
- Data/monitoring/indexing infrastructure: 257 projects.
- Yield/DeFi optimization: 257 projects.
- Privacy and identity: 260 projects.
- Stablecoin payment rails: 202 projects.
- Creator economy, GameFi, education, e-commerce, music/royalties and token launchpads are also frequent, but underperform relative to how often they are submitted.

Repeated weak forms:

- "AI assistant for everything" with no real execution path.
- "Wallet with simpler UX" without a new primitive, distribution hook, or security story.
- "Marketplace for X" where the only blockchain feature is tokenization/NFTs.
- "Learn-to-earn", "play-to-earn", generic creator monetization, and generic NFT/token-gating.
- Stablecoin payment app with no narrow wedge, no compliance/settlement edge, and no real merchant or B2B flow.

### Winning patterns from past projects

Grand prize pattern: technically deep primitive or infrastructure with a clear wedge.

- `unruggable-3` - Solana-native hardware wallet and companion app with security and native DeFi integrations.
- `tapedrive` - decentralized data storage layer with on-chain proofs and miner network.
- `reflect-protocol` - fully on-chain tokenized hedging protocol with delta-neutral strategies.
- `ore` - novel proof-of-work digital currency on Solana.

Public goods pattern: developer infrastructure, debugging, trust primitives, or education that other builders can actually use.

- `samui-wallet`, `idl-space`, `attest-protocol`, `zircon`.

Positive winner lift versus all submissions:

- Solana Data and Monitoring Infrastructure: 10.6% of winners vs 4.7% of all projects, +123% lift. Examples: `flowgate`, `arrow-api`, `ionic`, `pine-analytics`, `tokamai`, `hyperstack`.
- Solana Yield and DeFi Optimization: 9.9% winners vs 4.7% all, +109% lift. Examples: `carrot`, `split-finance`, `reflect-protocol`, `cleopetra`, `bestlend`.
- Solana DePIN Infrastructure Networks: 7.8% winners vs 3.5% all, +125% lift. Examples: `aquanode`, `netsepio`, `tapedrive`, `ore`.
- Stablecoin Payment Rails and Infrastructure: 6.8% winners vs 3.7% all, +83% lift. Examples: `remlo`, `zerocut`, `credible-finance-1`, `cargobill`, `borderless-wallets`.
- DEX and Trading Infrastructure: 7.8% winners vs 6.0% all, +32% lift. Examples: `vanish`, `solpipe`, `riverboat`, `archer-exchange`.
- Privacy and Identity: 5.1% winners vs 4.8% all, small +7% lift. Works when it is a core primitive, not a badge. Examples: `cloak-or-solana-privacy-layer`, `bagel`, `encifher`, `humanship-id`, `unruggable-3`.

Positive target-user patterns:

- Solana developers: +170% lift.
- dApp developers: +105% lift.
- yield farmers: +96% lift.
- retail traders: +89% lift.
- liquidity providers: +70% lift.
- DeFi traders: +63% lift.

Positive problem patterns:

- fragmented liquidity, liquidity fragmentation, capital inefficiency, complex trading interfaces, complex crypto onboarding.

Positive tech patterns:

- Rust, Anchor, TypeScript, real Solana programs, measurable on-chain execution, public repo, reproducible README.
- React Native/mobile can help when the mobile flow is central.
- AI/LLM alone underperforms: `ai` tag has negative lift, and AI-agent clusters are common but below winner share unless paired with payments, policies, DeFi execution, data, or security.

### Losing patterns

Negative lift clusters:

- Web3 Creator Economy Platforms: 0.7% winners vs 4.3% all, -84% lift.
- Gamified Web3 Education: 1.0% winners vs 3.0% all, -66% lift.
- Decentralized E-commerce: 1.4% winners vs 3.4% all, -60% lift.
- Music/Royalty Platforms: 1.7% winners vs 3.5% all, -52% lift.
- GameFi: 2.0% winners vs 4.1% all, -51% lift.
- Simplified Solana Payment Solutions: 3.1% winners vs 4.1% all, -25% lift.
- AI-Powered DeFi Assistants: 3.8% winners vs 5.0% all, -25% lift.
- Solana AI Agent Infrastructure: 4.8% winners vs 6.0% all, -20% lift.

Negative primitive/user patterns:

- NFT, token-gating, token launchpads, generic token rewards, broad marketplaces.
- Content creators, NFT collectors, gamers, community managers.
- Plain "information overload" or "complex web3 onboarding" narratives without a hard transaction, liquidity, data, privacy, or infra component.

### Archive signals used for ideation

- a16z "Are stablecoins money's WhatsApp moment?" - stablecoins are strongest when they are programmable internet-native money, not just another payment UI.
- a16z "Tourists in the bazaar: Why agents will need B2B payments - and why stablecoins will get there first" - agent commerce needs batched approvals, vendor payments, and policy controls.
- Galaxy "Agentic Payments and Crypto's Emerging Role in the AI Economy" - incumbents can copy surface-level agent payments, so the crypto wedge must be open, composable, programmable, and settlement-native.
- Helius "Solana's Stablecoin Landscape" - liquidity sourcing, KYC/AML, on/off ramps, and settlement are where stablecoin products become real.
- Paul Graham "Ideas for Startups" / "Organic Startup Ideas" - strongest ideas come from urgent problems and direct user pull, not sponsor bingo.

## Strategy for Frontier global tracks

The strongest multi-track project should look like one serious product first, with sponsor integrations as necessary modules.

Best overlap stack:

- Main Frontier + 100xDevs + Adevar + RPC Fast as the base.
- Stablecoin/payment layer for Tether QVAC and Palm USD.
- Privacy/confidential layer for Cloak, Umbra, Encrypt/Ika, MagicBlock.
- On-chain data layer for Dune SIM and GoldRush.
- Liquidity/action layer for LPAgent and possibly Jupiter.
- Incentive/distribution layer for Torque and theMiracle.
- Identity/policy layer for SNS and Zerion.

Avoid the trap: trying to touch 15 tracks by adding decorative API calls. Judges will reward centrality. Every integration should be visible in the demo and necessary to the product's core loop.

## 10 brainstormed ideas with critique

These are strategic directions, not final implementation specs.

| # | Idea | Tracks it can naturally touch | Winning patterns | Main critique | Top-1 potential |
|---|---|---|---|---|---|
| 1 | Private Agent Treasury for teams | 100xDevs, Adevar, RPC Fast, Tether QVAC, Palm USD, Cloak, Umbra, MagicBlock, Dune, GoldRush, Torque, SNS, Zerion, theMiracle | Stablecoin rails + agent payments + privacy + data/monitoring + scoped policies | Scope can explode. MVP must be "AI/team treasury with private stablecoin spend, human approval, audit trail". | Very high |
| 2 | Confidential Liquidity Router and LP Autopilot | 100xDevs, Adevar, RPC Fast, Encrypt/Ika, Cloak, Umbra, MagicBlock, Dune, GoldRush, LPAgent, Zerion, Torque | Yield/DeFi optimization + fragmented liquidity + real execution | DeFi is crowded. Needs real strategy metrics and not just a wrapper over APIs. | Very high |
| 3 | Privacy-Preserving Stablecoin Invoice and Settlement Network | 100xDevs, Adevar, RPC Fast, Tether QVAC, Palm USD, Cloak, Umbra, Dune, GoldRush, SNS, Torque, theMiracle | Stablecoin payment rails + B2B wedge + selective disclosure | Needs credible buyer/vendor workflow. Fake invoices will look like a toy. | High |
| 4 | Solana Agent Observability and Policy Firewall | 100xDevs, Adevar, RPC Fast, Dune, GoldRush, Zerion, SNS, Torque, Tether QVAC | Data/monitoring infra + developer target user + agent policies | Covers fewer privacy/stablecoin tracks unless payment execution is included. | High |
| 5 | Private DAO Payroll, Expenses, and Contributor Rewards | 100xDevs, Adevar, RPC Fast, Palm USD, Tether QVAC, Cloak, Umbra, Dune, GoldRush, Torque, SNS, theMiracle | Stablecoin rails + privacy + incentives + identity | DAO tooling is common. Needs a sharper wedge like private budget envelopes and compliance receipts. | Medium-high |
| 6 | Intent Settlement Engine for Multi-Step DeFi Actions | 100xDevs, Adevar, RPC Fast, Encrypt/Ika, MagicBlock, Cloak, Umbra, Dune, GoldRush, LPAgent, Zerion | Trading infra + liquidity fragmentation + agent execution | Hard to finish correctly. A narrow demo path is mandatory. | Very high but risky |
| 7 | Paid Agent API Marketplace with Stablecoin Micropayments | 100xDevs, RPC Fast, Tether QVAC, Palm USD, Dune, GoldRush, Torque, SNS, Zerion, theMiracle | Developer infra + agent payments + monetized APIs | Marketplace pattern is weak unless it ships one killer API/use case first. | Medium |
| 8 | Private Agent Identity and Reputation Layer | 100xDevs, Adevar, RPC Fast, SNS, Cloak, Umbra, MagicBlock, Dune, GoldRush, Zerion | Identity/privacy + policy + developer API | Identity alone has small winner lift. Must attach to payments or DeFi actions. | Medium-high |
| 9 | Confidential Supply-Chain Finance and Invoice Factoring | 100xDevs, Adevar, RPC Fast, Palm USD, Tether QVAC, Cloak, Umbra, Dune, GoldRush, LPAgent, SNS | Stablecoin B2B rails + RWA/credit + privacy + yield | Domain is heavy. Needs a focused vertical and realistic sample data. | High |
| 10 | Private Spend Rewards and Acquisition Engine | 100xDevs, RPC Fast, Palm USD, Tether QVAC, Cloak, Umbra, Dune, GoldRush, Torque, theMiracle, SNS | Incentives + stablecoin spend + private receipts | Consumer loyalty underperforms. Better as growth module inside ideas 1/3/5. | Medium |

### Best three directions

1. Private Agent Treasury for teams.
   - Best balance of sponsor coverage, current market timing, and winner patterns.
   - Covers stablecoins, privacy, identity, data, policies, agent execution, incentives.
   - Can be demoed with a clear workflow: create policy, agent requests spend, human approves batch, payment executes privately, analytics/audit update.

2. Confidential Liquidity Router and LP Autopilot.
   - Best fit for historically high-lift DeFi/yield/data categories.
   - Strong for LPAgent, Dune, GoldRush, Zerion, privacy tracks.
   - Harder to make safe and credible in limited time.

3. Privacy-Preserving Stablecoin Invoice and Settlement Network.
   - Best B2B stablecoin wedge.
   - Stronger than generic consumer payments because it has buyer/vendor workflows, receipts, settlement, audit, and privacy.
   - Must avoid becoming just "crypto invoices".

### Recommended path

Pick idea 1 unless the team is strongest in DeFi engineering, in which case pick idea 2.

Reason: idea 1 covers the most global tracks without feeling like sponsor bingo, maps to strong archive signals around agentic payments, and avoids the historically weak "generic AI assistant" pattern by anchoring AI to policy-controlled stablecoin execution.

## Locked Product - VeilSettle

Decision date: 2026-05-02.

VeilSettle is a privacy-preserving stablecoin invoice settlement layer for Web3 agencies, freelancers, and contractors.

MVP use case: a Web3 dev/security agency invoices a client for a protocol audit sprint. The client reviews the invoice locally, pays with a PUSD-first stablecoin flow, and both sides receive a selective-reveal receipt. Public observers can verify status and hashes, but cannot see amount, line items, memo, attachments, or client context.

Core flow:

1. Agency creates one-time encrypted invoice.
2. Solana commitment registry stores only hashes/status/proof reference.
3. Client reviews invoice with local QVAC consistency checks.
4. Client signs private payment through Cloak-backed adapter.
5. Payment proof marks invoice paid.
6. Dune/GoldRush settlement dashboard indexes public status events.
7. Early payment emits Torque `invoice_paid_early`.

Architecture baseline:

- Next.js + TypeScript web app.
- Supabase/Postgres stores encrypted blobs and non-sensitive status/indexes.
- Anchor program is a commitment registry, not escrow.
- Cloak is the critical private-payment integration.
- Umbra, Zerion, and MagicBlock are conditional/stretch unless real integrations are demoable.

Primary target tracks:

- Main Colosseum Frontier
- 100xDevs
- Adevar Labs
- RPC Fast
- Tether QVAC
- Palm USD
- Cloak
- Dune SIM
- GoldRush
- SNS
- Torque
- theMiracle

Conditional tracks:

- Umbra: only if the SDK-backed route is demonstrable.
- Zerion: only if scoped payment preparation/execution is real.
- MagicBlock: only if a real private execution integration is added.

Not targeted by default:

- LPAgent/Jupiter, because invoice settlement does not naturally need liquidity routing.
- Encrypt/Ika, unless the product expands into encrypted capital-market settlement.
- SagaPad/dum.fun, because they require separate artifacts or unrelated activity.
- Regional tracks unless the team can truthfully satisfy regional eligibility.

Implementation plan:

- docs/superpowers/plans/2026-05-02-veilsettle-mvp.md
