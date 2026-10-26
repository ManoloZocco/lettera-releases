# Topre Purple Hybrid PBT — typing samples

Six recordings of a Topre Purple Hybrid (PBT keycaps) switch, used for the "Topre" typing sound.

- **Source pack:** `purple_hybrid_pbt` by *mechvibes*, distributed through
  [thock-soundpacks](https://github.com/kamillobinski/thock-soundpacks)
- **Upstream project:** [Mechvibes](https://github.com/hainguyents13/mechvibes)
- **License:** MIT

## Processing applied

The originals are 85 WAVs, one per key, 44.1 kHz. Six were selected for a
consistent timbre (closest to the pack's median spectral centroid) and then:

1. **Trimmed to the strike.** Each original carries tens of milliseconds of
   room tone before the transient — shipped untouched, that is audible lag on
   every keystroke. The onset is found by walking back from the peak to 4% of
   its amplitude, keeping 2 ms of pre-roll.
2. Cut at the strike and kept up to 180 ms, each sample keeping its own natural
   decay, with a 0.5 ms fade-in and 8 ms fade-out to avoid boundary clicks.
3. Downmixed to mono and normalised to 0.9 peak, so no key sounds louder than
   another.

Result: ~45 KB, attack at ~1-2 ms.
