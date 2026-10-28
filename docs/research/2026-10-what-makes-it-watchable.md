# What makes a breadth segment watchable (28 Oct 2026)

**Trigger:** the owner reviewed the colourful v3 previews and said: "not really that good that can attract viewers".

**Method:** a web search on retention for faceless educational channels, map-led explainers (Vox, Johnny Harris), Indian explainers (Dhruv Rathee), the large UPSC channels, and learning research. Most of the sources are creator or vendor blogs. Their numbers are rough targets, not evidence; the principles they agree on are what count.

## What the sources agree on

1. **The first 15–30 s decide it.** Viewers leave when they cannot tell what they will get, when the opening is slow, or when the opening does not match the title. vidIQ's target is 60%+ of viewers still watching at 0:30. ([vidIQ](https://vidiq.com/blog/post/increase-audience-retention-youtube/); [Teleprompter](https://www.teleprompter.com/blog/youtube-audience-retention))
2. **Without a face, the edit carries the energy.** Guides for faceless channels recommend a visual change every 3–5 s, counting overlays, graphics and zooms. ([Pippit](https://www.pippit.ai/resource/top-tips-for-building-audience-retention-on-faceless-youtube-channels); [Framesail](https://framesail.com/blog/high-retention-faceless-youtube-videos))
3. **Pay off regularly.** One guide recommends a payoff every 60–90 s, and another notes that the mid-point is the second-biggest drop. ([virvid](https://virvid.ai/blog/faceless-youtube-algorithm-retention-2026); [TubeAnalytics](https://www.tubeanalytics.net/blog/fix-low-audience-retention-youtube-videos))
4. **Visual evidence first, context second** (Johnny Harris). The map style that works is a clean map that zooms in, a country that fills with colour, and callouts landing on cue. It feels human because of deliberate imperfection: hand-drawn arrows, paper, stepped motion. ([aescripts](https://aescripts.com/learn/post/how-johnny-harris-makes-maps); [Medium](https://medium.com/@seijiyushin/why-every-documentary-on-youtube-suddenly-looks-like-vox-6220588e60ba); [FCPX](https://fcpxfullaccess.com/blogs/blog/vox-johnny-harris-documentary-style-final-cut-pro))
5. **Hook, then background, then the present**, with charts and animation carrying the data (Dhruv Rathee, as analysed second-hand). ([Recapio](https://recapio.com/digest/how-to-research-like-dhruvrathee-script-like-dhruv-rathee-by-tube-sensei))
6. **Curiosity is an information gap.** A question posed and answered later keeps people watching. ([Frontiers in Medicine 2021](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8602070/))

## Diagnosis of our v3 previews

| Problem | Why it hurts | Evidence in v3 |
|---|---|---|
| **No human voice** | The biggest gap. A silent preview over a near-inaudible pad (about −35 dB) cannot hold anyone, whatever the visuals do. | Review previews only |
| **The same frame for 30 s** | Each card was a static notes layout with rows fading in: one visual change every 6–10 s, not every 3–5 s | All 23 cards |
| **The notes came first** | The copy-ready frame was on screen from second 1, so there was no reveal and no payoff | All cards |
| **No hook** | The Grid opened on a board of 16 labels | G.0 |
| **Template fatigue** | 23 identical layouts in a row | Grid + Desk |
| **No real imagery beyond maps** | Wikimedia, PIB and NASA are blocked from the cloud session; only Sentinel-2 and terrain tiles are reachable | Network |

## What changed (v4 prototype: hook, Arnab, IDBI, BRICS, Kolleru)

- **Two acts per card:**
  - **Act 1 (about 60%), the visual fills the frame:** a camera flight from India down to the place, a satellite fade-in, a chart that fills the screen, members lighting up on a world map. Big fact cards pop on their words, and hand-drawn ink circles and arrows appear. The title starts big at the bottom, then shrinks to the top to clear the map.
  - **Act 2 (from about 2 s before "Prelims Trap"):** the full-frame visual shrinks into the window, and the notes, look-alike table and trap assemble. This is the copy-ready payoff, landing on an impact sound.
- **Teaching visuals, not decoration:**
  - the Puducherry UT four-enclave inset lands on "Puducherry";
  - BRICS members light up as each one is named;
  - the Saudi Arabia outline is dashed on "Saudi".
- **Hook:** four 0.9 s preview shots (Arnab satellite, BRICS world map, Kolleru, Sukhna), then the board.
- **Sound** (`sound_bed.py --pulse`, all self-made):
  - a 92 bpm music bed (soft kick, hat, a plucked Am–F–C–G progression);
  - a whoosh on each card change;
  - an impact on the settle;
  - a two-note chime on each trap.
  - Preview beds are normalised to −20 LUFS.
- **Colour:** India is filled saffron and other countries green, on a blue sea.

## Still needed, in order of impact

1. **Mounika's voice.** Even a phone-recorded scratch read of the Grid would show the real pace. `align_vo.py` and `timeline.py --align` sync the visuals to it automatically. Text-to-speech is not allowed for anything published (CLAUDE.md §1).
2. **Roll the two-act format** out to the remaining 18 cards. Vary act 1 by type (map flight, satellite before/after wipe, a chart that morphs, a case-file board) so the 23 cards stop looking identical.
3. **A mid-Grid pattern interrupt:** a 10 s quick-fire "how many of these traps did you spot" card after item 8, which closes the hook's open loop halfway.
4. **Real photographs:** allow `upload.wikimedia.org` and `commons.wikimedia.org` in the environment's network settings to get licensed photos (with a licence check per file, §6.4).
5. **Packaging:** three title and thumbnail concepts for the hub (CLAUDE.md §7), tested against the retention curve after the first upload.
