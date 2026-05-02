# Frontier Hackathon Research Documentation

Дата анализа: 2026-05-02.

Цель документа: сохранить рабочую информацию по Colosseum Frontier и Superteam Earn sidetracks, чтобы выбрать набор треков для одного проекта. Конкретные идеи продукта здесь намеренно не предлагаются.

## Источники

- Colosseum Frontier: https://colosseum.com/frontier
- Official Rules PDF: https://colosseum.com/legal/Solana%20Frontier%20Hackathon%20Rules.pdf
- Colosseum Hackathon FAQ: https://colosseum.com/hackathon
- Colosseum announcement: https://blog.colosseum.com/announcing-the-solana-frontier-hackathon/
- Superteam Earn Frontier sidetracks: https://superteam.fun/earn/hackathon/frontier
- Superteam Earn track data endpoint used for current list: https://superteam.fun/api/hackathon/frontier

## Главные условия Colosseum Frontier

- Период конкурса: 2026-04-06 06:00 PT - 2026-05-11 23:59 PT.
- Регистрация каждого участника должна быть до 2026-05-04 23:59 PT.
- Победителей Colosseum должны объявить примерно к 2026-06-23.
- Участник может быть членом только одной команды. Команда может подать только один проект.
- Весь контент должен быть на английском.
- Оценка: functionality/code quality, potential impact, novelty, UX, open-source/composability, business plan.
- Призы Colosseum: Grand Champion $30,000, Public Goods $10,000, University $10,000, еще 20 standout teams по $10,000.
- Accelerator: победители рассматриваются для Colosseum accelerator; публичный анонс говорит о $250,000 pre-seed для 10+ выбранных стартапов.
- Важно по eligibility: официальные правила исключают лиц, находящихся или обычно проживающих в Afghanistan, Belarus, Cuba, Iran, North Korea, Russia, Somalia, Syria, Crimea/Sevastopol, Donetsk, Luhansk, Zaporizhzhia, Kherson regions of Ukraine, Venezuela, Yemen, а также санкционные лица/организации. Реальную eligibility надо проверить по фактическому месту проживания и гражданско-правовому статусу команды до подачи.

## Общие правила Superteam Earn sidetracks

- Sidetracks отдельны от main Colosseum Frontier. Нужно подаваться отдельно в каждый Superteam Earn sidetrack.
- Один проект можно подать в несколько sidetracks, если он реально соответствует требованиям каждого.
- Почти все sidetracks требуют ссылку на официальный Colosseum profile, GitHub, описание проекта. Многие требуют demo video, deck, website и/или X post.
- Большинство sidetracks имеют deadline на Superteam Earn 2026-05-12 11:59:59 UTC, но основной Colosseum submission должен быть сделан до дедлайна Colosseum. Практически: сначала подать в Colosseum, затем в Superteam Earn.
- Regional tracks обычно требуют выбрать нужную страну в Colosseum submission или иметь meaningful connection к региону/сообществу. Если команда не может честно подтвердить регион, шанс в таком треке считать 0%.

## Методика процента успеха

Это не настоящая вероятность победы. Это грубый статистический индикатор конкуренции на момент анализа:

`naive success % = prize spots / (current visible submissions + 1) * 100`, максимум 100%.

Что игнорируется:

- качество проекта;
- рост числа заявок до дедлайна;
- региональная eligibility;
- субъективное судейство sponsor tracks;
- разница между cash prizes, credits, in-kind rewards и wallet placement;
- скрытые/невалидные заявки.

Использовать так: сначала отсеять eligibility, затем смотреть на overlap с одним проектом, затем на приз и конкуренцию.

## Вывод по стратегии одного проекта

Один проект может закрыть значительную часть глобальных sidetracks, но не большинство всех 52, потому что много треков региональные или требуют отдельный артефакт. Реалистичный максимум для одной команды без региональных прав - примерно 12-18 релевантных подач, если проект осознанно покрывает несколько пересекающихся требований.

Лучший non-regional набор для одного проекта:

- Main Colosseum Frontier.
- 100xDevs - общий Solana track.
- Adevar Labs - если проект в DeFi/RWA/consumer/stablecoins и есть сильная security documentation.
- RPC Fast - если есть понятная Solana infrastructure/RPC dependency и README/demo.
- Palm USD/Tether - если в проекте есть meaningful stablecoin/AI-wallet/payment integration.
- Umbra/Cloak/Encrypt/Ika/MagicBlock - если privacy/confidentiality/interoperability реально часть core flow.
- Dune/GoldRush/LPAgent/Jupiter - если проект использует onchain data, trading, liquidity или analytics APIs.
- Torque/theMiracle - если есть measurable incentive/acquisition campaign.
- SNS - если identity/social identity/agent identity естественно встроена.
- Zerion - если есть autonomous onchain execution with policies.

Не стоит строить стратегию вокруг региональных sidetracks, пока не подтвержден регион команды. Если eligibility есть, regional track почти всегда надо добавлять, потому что конкуренция ниже и критерии часто зеркалят main Frontier.

## Сводная таблица sidetracks

| # | Track | Region | Prize | Submissions | Spots | Naive % | Условия участия |
|---|---|---:|---:|---:|---:|---:|---|
| 1 | Adevar Labs security audit credits | Global | 50,000 USDC credits | 11 | 5 | 42% | Только проекты, submitted to official Frontier. Приоритет Demo Day участникам. Нужны Colosseum link, GitHub, tech docs, project description, security statement, funding/pitch deck. Фокус: DeFi, RWAs, consumer apps, stablecoins. |
| 2 | Eitherway live dApp with Solflare/Kamino/DFlow/Quicknode/Birdeye | Global | 20,000 USDC | 28 | 6 | 21% | Нужно live Solana mainnet dApp, созданное/deployed через Eitherway, с одним из partner integrations. Требуются user flow, first users plan, 30-day live plan, demo video. |
| 3 | Encrypt and Ika | Global | 15,000 USDC | 8 | 5 | 56% | Проект должен использовать Encrypt and/or Ika для encrypted/bridgeless capital markets. Нужны public GitHub, README, build/test/use instructions, deployed links, video, deck, ответы о centrality/novelty/limitations. |
| 4 | theMiracle wallet placement | Global | 10,000 USDC placement value | 0 | 1 | 100% | Нужно оформить Benefit Proposal: audience, action, incentive, value. Нужны hackathon project link, website/deck, growth context, ideal customer persona. Награда - wallet placement value, не обычный cash prize. |
| 5 | Tether QVAC | Global | 10,000 USDT | 4 | 3 | 60% | Нужно быть валидной Frontier submission и meaningful integrate QVAC SDK as core functionality. Нужны public GitHub, working demo/video, ответ как QVAC встроен. |
| 6 | Superteam Nepal | Nepal | 10,000 USDG | 0 | 11 | 100% | Нужно выбрать Nepal как primary country или иметь meaningful connection к Nepal/Superteam Nepal, участвовать в локальной поддержке/buildstations, подать в Colosseum и Superteam Earn. |
| 7 | Canada Prize Track | Canada | 10,000 USDG | 0 | 3 | 100% | Для команд, based in Canada или registered with Canada as primary location. Нужно Colosseum submission, Superteam Earn submission, GitHub, Colosseum profile. |
| 8 | SuperteamNG x Raenest | Nigeria | 10,000 USDG | 6 | 3 | 43% | Нужно зарегистрироваться и податься с Nigeria как country, участвовать в Superteam Nigeria build stations/hacker hostel/bootcamps/review sessions. |
| 9 | Umbra privacy SDK | Global | 10,000 USDC | 10 | 3 | 27% | Нужно построить product/prototype with Umbra SDK for transactional privacy. Требуются public GitHub, README, build/test/use instructions, deployed links, demo video under 5 min. |
| 10 | Superteam Poland x ElevenLabs | Poland | 10,000 USDG | 3 | 3 | 75% | Нужно подать проект в Colosseum и Superteam Earn, mark Poland as country, comply with global rules. Track mentions partner/product integration with ElevenLabs. |
| 11 | Indonesia National Campus Hackathon | Indonesia | 10,000 USDG | 1 | 7 | 100% | Только currently enrolled students at accredited Indonesian universities. Требуются student IDs/card proof, functional MVP, original code, live product/MVP link, demo video/deck. |
| 12 | Superteam Turkey x Halborn | Turkey | 10,000 USDG | 0 | 3 | 100% | Нужно mark Turkey as country in Colosseum, submit to Colosseum and Superteam Earn, comply with global rules. |
| 13 | Superteam Japan | Japan | 10,000 USDG | 1 | 10 | 100% | Must be based in Japan, submit to Colosseum, satisfy Frontier rules, and be eligible to complete KYC as resident of Japan. |
| 14 | Superteam Brasil | Brazil | 10,000 USDG | 2 | 10 | 100% | Для Brazilian builders participating in Frontier. Нужно Colosseum submission, Superteam Earn submission, GitHub, Colosseum profile. |
| 15 | Superteam Balkan x SEE ICT | Balkan | 10,000 USDG | 1 | 5 | 100% | Для Balkan-connected builders. Нужны Colosseum and Superteam Earn submissions, project website, Twitter, GitHub. Оценка: ecosystem impact, PMF, technical quality. |
| 16 | La Familia Frontier Track | Spain | 10,000 USDG | 0 | 6 | 100% | Нужно mark Spain as country, submit to Colosseum and Superteam Earn, comply with official rules. Оценка: ecosystem impact, PMF, technical quality. |
| 17 | Ukrainian Track | Ukraine | 10,000 USDG | 6 | 3 | 43% | Для teams in Ukraine, must submit to Colosseum Frontier. Важно сверить official sanctions exclusions by region. |
| 18 | Superteam Ireland | Ireland | 10,000 USDG | 1 | 5 | 100% | Нужно mark Ireland as country, submit to Colosseum and Superteam Earn, comply with official rules. |
| 19 | Superteam Georgia | Georgia | 10,000 USDG | 0 | 3 | 100% | Нужно registered/submitted on Colosseum, meaningful connection to Georgia or Superteam Georgia community, demo/video/deck/docs. |
| 20 | 100xDevs Frontier Track | Global | 10,000 USDC | 27 | 10 | 36% | Нужно участвовать в Colosseum Frontier, project built on Solana, submitted to Colosseum and Superteam Earn, eligible under official rules. |
| 21 | Singapore Track | Singapore | 10,000 USDG | 0 | 3 | 100% | Нужно mark Singapore as country, submit to Colosseum and Superteam Earn, comply with official rules. |
| 22 | NeosLegal x Superteam UAE | UAE | 10,000 USDG | 2 | 3 | 100% | Нужно official Frontier submission. At least one core member with UAE residency, UAE entity, or credible intent to relocate/incorporate. Need GitHub, demo, deck. |
| 23 | Visa/Superteam Germany | Germany | 10,000 USDG | 2 | 3 | 100% | Нужно mark Germany as country, submit to Colosseum and Superteam Earn, comply with official rules. |
| 24 | Superteam MY x AppWorks x Jelawang Capital | Malaysia / Network State | 10,000 USDC | 1 | 4 | 100% | Нужно select Malaysia or Network State, meaningful connection to Malaysia/Superteam MY/Network School, high-quality pitch/video/docs, submit to both platforms. |
| 25 | RPC Fast infrastructure credits | Global | 10,000 USDC credits | 9 | 4 | 40% | Colosseum submission mandatory. Нужны public GitHub, README setup/run, demo/deck, follow RPC Fast on X, join Telegram, clear infra use case. |
| 26 | Seoulana x Rocketpunch | South Korea | 10,000 USDG | 1 | 4 | 100% | Нужно register with Korea as primary country, submit to Colosseum and Earn. Нужны live product demo video, pitch video, pitch deck, website, GitHub. |
| 27 | Superteam India x Dodo Payments | India | 10,000 USDG | 4 | 3 | 60% | Нужно build payments/finance app using stablecoins on Solana and integrate Dodo Payments. Нужно Frontier submission and Earn submission. |
| 28 | Superteam Australia | Australia | 8,000 USDG | 5 | 3 | 50% | Нужно select Australia as country, submit to Colosseum and Earn, comply with official rules. |
| 29 | Superteam NL x AISO | Netherlands | 8,000 USDG | 2 | 5 | 100% | Нужно select Netherlands as country, submit to Colosseum and Earn, comply with official rules, provide Telegram. |
| 30 | Dune Analytics SIM Data | Global | 6,000 USDC plan | 2 | 1 | 33% | Проект должен use one or more Dune SIM endpoints, SVM or EVM. Нужен clear demo of SIM usage. Can be submitted to multiple tracks. |
| 31 | Cloak private payments | Global | 5,010 USDC | 12 | 5 | 38% | Нужно working demo/live deployment or local setup, public GitHub, README explaining Cloak SDK centrality, demo video under 5 min, Frontier submission. |
| 32 | KAST Pakistan | Pakistan | 5,000 USDC | 2 | 3 | 100% | Open to Pakistani individuals/teams. Нужно Colosseum and Earn submissions, mark Pakistan, KAST wallet username, deck, MVP, 2-3 min demo. |
| 33 | Zerion CLI autonomous onchain agent | Global | 5,000 USDC | 11 | 3 | 25% | Нужно fork Zerion CLI, build execution/wallet layer, define scoped policy, execute real onchain transaction through Zerion API, submit GitHub and Colosseum profile. |
| 34 | SNS Identity Track | Global / Malaysia-linked listing | 5,000 USDC | 1 | 3 | 100% | Нужно Colosseum submission, public GitHub, clear explanation of identity/social identity/agent identity on Solana. Listing references Malaysia or Network State selection. |
| 35 | MagicBlock Privacy Track | Global | 5,000 USDC | 14 | 3 | 20% | Нужно live deployment with successful MagicBlock integration, public GitHub, short demo video, deployment link, demo link, project X profile. |
| 36 | Superteam Kazakhstan | Kazakhstan | 4,000 USDG | 6 | 3 | 43% | Нужно register and submit to Frontier, meet global rules, indicate Kazakhstan/Superteam KZ affiliation where applicable, include demo/deck/docs/GitHub. |
| 37 | Torque MCP | Global | 3,000 USDC | 5 | 3 | 50% | Project must pass custom_events, trigger incentives, or distributors through Torque MCP/API. Need public GitHub and demo video on X tagging Torque. |
| 38 | GoldRush by Covalent | Global | 3,000 USDC | 8 | 3 | 33% | Project must use one or more GoldRush API endpoints. Need public GitHub, demo video on X tagging GoldRush, Colosseum profile. |
| 39 | Superteam KZ and METAFORRA | Kazakhstan | 3,000 USDG | 1 | 3 | 100% | Need Frontier submission, global rules, meaningful Kazakhstan/Superteam KZ connection. Project should relate to gaming, digital ownership, RWA, financial infra, AI, or Web2 to Web3 UX. |
| 40 | Superteam KZ x S1lkPay | Kazakhstan | 3,000 USDG | 2 | 3 | 100% | Need Frontier submission, global rules, meaningful Kazakhstan/Superteam KZ connection. Project should relate to payments, commerce, financial infra, AI + fintech, or virtual card workflows. |
| 41 | Jupiter Developer Platform | Global | 3,000 jupUSD | 112 | 4 | 4% | Need build with Jupiter Developer Platform APIs or integrate them into existing Solana product and provide honest feedback. Extremely crowded by current submissions. |
| 42 | LI.FI Germany | Germany | 2,500 USDC | 2 | 3 | 100% | Need live demonstrable LI.FI integration with widget/API/SDK: cross-chain swaps, deposits, multi-step DeFi flows, agents. Requires Superteam Germany affiliation question and LI.FI builder group. |
| 43 | LI.FI Balkan | Balkan | 2,500 USDC | 1 | 3 | 100% | Same LI.FI requirements as Germany track, but asks Superteam Balkans affiliation. |
| 44 | Jito infrastructure | Germany | 2,000 USDC | 0 | 1 | 100% | Need meaningful Jito infrastructure use: Block Engine, bundles, ShredStream, JitoSOL, restaking, StakeNet, BAM. Telegram group required. |
| 45 | Zerion CLI Germany | Germany | 2,000 USDC | 0 | 3 | 100% | Same core Zerion agent requirements: fork CLI, scoped policy, real onchain transaction through Zerion API. Region is Germany. |
| 46 | Australia First-Time Builders | Australia | 2,000 USDG | 2 | 3 | 100% | For new Solana/crypto builders. Need select Australia, submit to Colosseum and Earn, comply with official rules. |
| 47 | NL First-Time Builders | Netherlands | 2,000 USDG | 1 | 8 | 100% | Must be first Solana project, select Netherlands, submit to Colosseum and Earn, comply with official rules. |
| 48 | KIRAPAY | Malaysia | 1,505 USDC | 0 | 2 | 100% | Need English submission, working prototype/live demo, public repo, KIRAPAY API live transactions, video demo max 5 min, project write-up. |
| 49 | SagaPad agentic skills | Global | 1,000 USDC | 4 | 3 | 60% | Separate artifact: public GitHub skill repo, repo name must match skill.md, publish on SagaPad Skill Marketplace under Colosseum Hackathon, X post link. |
| 50 | LPAgent API integrate | Global | 900 USDC | 5 | 4 | 67% | Project must use LP Agent endpoints and Zap in/out API, include clear demo of LP Agent usage. Can be submitted to multiple tracks. |
| 51 | dum.fun token launch | Global | 500 USDC | 13 | 4 | 29% | Separate activity: launch token on dum.fun devnet, place 3 bets, trade on 2 bonding curves, post on X, join Telegram, submit launched token, wallet, bet screenshot, X post, 200+ word feedback. |
| 52 | Palm USD | Global | 10,000 PUSD | 8 | 3 | 33% | Need Solana project using PUSD as core component. Working prototype preferred. Need Colosseum link, GitHub, demo video, 5 min pitch deck max 12 slides. |

## Лучшие цели по соотношению overlap/prize/competition

Без подтвержденной региональной eligibility:

1. Main Frontier + 100xDevs + Adevar Labs + RPC Fast - базовый пакет почти для любого сильного Solana продукта с нормальным README, demo, security docs и Colosseum profile.
2. Tether + Palm USD + Dodo/KIRAPAY only if payment/stablecoin requirements are genuinely satisfied.
3. Encrypt/Ika + Umbra + Cloak + MagicBlock only if privacy/confidentiality is central, not decorative.
4. Dune + GoldRush + LPAgent + Jupiter only if data/liquidity/trading APIs are actually used in the product.
5. Torque + theMiracle if there is a measurable incentive/acquisition flow.
6. Zerion if an autonomous onchain agent with scoped policies is part of the real product.
7. SagaPad and dum.fun are lower-overlap because they require separate deliverables or behavior outside the core product.

If regional eligibility exists, add exactly those regional tracks. They often have much better visible competition, but false regional claims risk disqualification.

## Track documentation links

Main resources:

- Colosseum Frontier: https://colosseum.com/frontier
- Colosseum official rules: https://colosseum.com/legal/Solana%20Frontier%20Hackathon%20Rules.pdf
- Colosseum FAQ: https://colosseum.com/hackathon
- Superteam Earn Frontier: https://superteam.fun/earn/hackathon/frontier
- Colosseum developer resources linked from Superteam FAQ: https://www.colosseum.com/cypherpunk/resources

Sponsor docs and APIs:

- Eitherway: https://eitherway.ai/chat
- Solflare docs: https://docs.solflare.com/solflare
- Kamino docs: https://kamino.com/docs/build/developers/overview
- DFlow docs: https://pond.dflow.net/build/introduction
- Birdeye docs: https://docs.birdeye.so/
- QuickNode Solana: https://www.quicknode.com/chains/sol
- Encrypt docs: https://docs.encrypt.xyz/
- Ika devnet: https://solana-pre-alpha.ika.xyz/
- Tether QVAC docs: https://docs.qvac.tether.io
- Tether QVAC GitHub: https://github.com/tetherto/qvac
- Tether WDK: http://wdk.tether.io
- Umbra SDK: https://sdk.umbraprivacy.com/
- Umbra docs: https://docs.umbraprivacy.com/
- RPC Fast docs: https://docs.rpcfast.com/rpc-fast-saas-solana/introduction
- Dune SIM SVM docs: https://docs.sim.dune.com/svm/overview
- Dune SIM EVM subscriptions: https://docs.sim.dune.com/evm/subscriptions
- Cloak docs: https://docs.cloak.ag/sdk/introduction
- Cloak quickstart: https://docs.cloak.ag/sdk/quickstart
- MagicBlock quickstart: https://docs.magicblock.gg/pages/ephemeral-rollups-ers/how-to-guide/quickstart
- MagicBlock private rollups quickstart: https://docs.magicblock.gg/pages/private-ephemeral-rollups-pers/how-to-guide/quickstart
- Torque MCP quickstart: https://platform.torque.so/docs/mcp/quickstart
- Torque MCP custom events: https://platform.torque.so/docs/mcp/tools/custom-events
- GoldRush docs: https://goldrush.dev/docs
- Jupiter Developer Platform: https://developers.jup.ag/
- Jupiter AI docs: https://developers.jup.ag/docs/ai
- LI.FI API docs: https://docs.li.fi/api-reference/introduction
- LI.FI SDK docs: https://docs.li.fi/sdk/overview
- Zerion CLI repo: http://github.com/zeriontech/zerion-ai
- Zerion developers: http://developers.zerion.io
- KIRAPAY docs: https://docs.kira-pay.com/
- KIRAPAY dashboard: https://dashboard.kira-pay.com
- LPAgent docs: https://docs.lpagent.io/introduction
- LPAgent portal: https://portal.lpagent.io/
- Palm USD contact for closed repos: hello@palmusd.com

## Submission checklist for one multi-track project

- Confirm legal/geographic eligibility before spending time on regional tracks.
- Register all team members on Colosseum before 2026-05-04 23:59 PT.
- Submit one main project to Colosseum before 2026-05-11 23:59 PT.
- Prepare public GitHub repo unless sponsor allows private repo access.
- README must include problem, target user, architecture, setup/run instructions, deployed program IDs, frontend link, sponsor integrations, and known limitations.
- Demo video should show the product working end to end, not only slides or code walkthrough.
- Pitch deck should explain problem, solution, why Solana, market, traction, roadmap, and team.
- For every sidetrack, write a separate answer explaining why that sponsor integration is central.
- Keep all sponsor-specific proofs: screenshots, X posts, Telegram handles, wallet addresses, deployed URLs, demo links.
