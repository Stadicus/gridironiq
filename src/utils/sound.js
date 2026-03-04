// Web Audio API sound effects — synthesised on the fly, no audio files needed.
// AudioContext is created lazily on first use to satisfy browser autoplay policy.

let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function isEnabled() {
  try {
    const raw = localStorage.getItem('gridiron-iq:v1')
    if (!raw) return true
    return JSON.parse(raw).settings?.soundEnabled !== false
  } catch { return true }
}

// Single tone with smooth attack and exponential decay
function tone(freq, { type = 'sine', start = 0, duration = 0.15, gainPeak = 0.22 } = {}) {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.type = type
  osc.frequency.value = freq
  const t0 = ac.currentTime + start
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

// Tone with smooth frequency glide (for the "wrong" descending bwomp)
function glideTone(startFreq, endFreq, { type = 'sine', start = 0, duration = 0.3, gainPeak = 0.20 } = {}) {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.type = type
  const t0 = ac.currentTime + start
  osc.frequency.setValueAtTime(startFreq, t0)
  osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + duration * 0.85)
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

// ── Public sound events ───────────────────────────────────────────────────────

export function playCorrect() {
  if (!isEnabled()) return
  // Warm major-chord arpeggio: C5 → E5 → G5 (like a coin-collect chime)
  tone(523, { start: 0,    duration: 0.16, gainPeak: 0.20 })  // C5
  tone(659, { start: 0.07, duration: 0.16, gainPeak: 0.18 })  // E5
  tone(784, { start: 0.14, duration: 0.26, gainPeak: 0.16 })  // G5
}

export function playWrong() {
  if (!isEnabled()) return
  // Classic game-show descending "bwomp" — square wave gliding down a minor 7th
  glideTone(320, 160, { type: 'square', duration: 0.34, gainPeak: 0.15 })
}

export function playLevelUp() {
  if (!isEnabled()) return
  // Triumphant ascending fanfare: C5 E5 G5 C6
  ;[523, 659, 784, 1047].forEach((freq, i) =>
    tone(freq, { start: i * 0.10, duration: 0.24, gainPeak: 0.18 })
  )
}

export function playBadge() {
  if (!isEnabled()) return
  // Bright sparkle arpeggio
  ;[880, 1100, 1320, 1760].forEach((freq, i) =>
    tone(freq, { start: i * 0.07, duration: 0.15, gainPeak: 0.15 })
  )
}
