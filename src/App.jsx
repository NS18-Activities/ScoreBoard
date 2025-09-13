import React, { useState, useRef } from 'react'

// HarryPotterPrizeWheel.jsx
// Default export: React component you can drop into a create-react-app or Vite + React project.
// Uses Tailwind for styling. Make sure Tailwind is configured in your project.
const prizes = [
 { label: 'Powerbank', emoji: '🔋', color: '#5B2A86' },
 { label: 'AirPods', emoji: '🎧', color: '#1F3B4D' },
 { label: 'Watch', emoji: '⌚', color: '#B85C00' },
 { label: 'Powerbank', emoji: '🔋', color: '#6F2DA8' },
 { label: 'AirPods', emoji: '🎧', color: '#163446' },
 { label: 'Watch', emoji: '⌚', color: '#C46A00' },
 { label: 'Powerbank', emoji: '🔋', color: '#7D3AC0' },
 { label: 'AirPods', emoji: '🎧', color: '#10323C' },
 { label: 'Watch', emoji: '⌚', color: '#D2872A' },
]

export default function App({
  size = 420,
  spinDuration = 5000,
  fontFamily = 'HarryPotter, serif',
}) {
  // prizes: array of objects: { label, emoji, color }
  const slices = prizes
  const sliceCount = slices.length
  const sliceAngle = 360 / sliceCount

  const [rot, setRot] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const wheelRef = useRef(null)

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  async function spin() {
    if (spinning) return
    setResult(null)
    setSpinning(true)

    // Pick a random slice index as the prize
    const chosenIndex = randomInt(0, sliceCount - 1)

    // Compute target rotation so that the chosen slice lands at pointer (top)
    // We use `from -90deg` in the CSS conic-gradient so 0deg is at top.
    // finalAngle (0-360) should be inside the chosen slice span.
    const minAngle = chosenIndex * sliceAngle
    const maxAngle = (chosenIndex + 1) * sliceAngle

    // Choose an angle inside the slice
    const angleInSlice = Math.random() * (maxAngle - minAngle) + minAngle

    // Add many full rotations so it looks good
    const spins = randomInt(6, 9) // number of full 360 spins
    const targetRotation = spins * 360 + angleInSlice

    // Animated rotation
    setRot((r) => r + targetRotation)

    // Wait for animation to finish
    await new Promise((res) => setTimeout(res, spinDuration + 200))

    // Determine final absolute landing index (based on absolute rotation)
    const final = (rot + targetRotation) % 360 // rot is previous rotation
    // Normalize to [0,360)
    const landingAngle = ((final % 360) + 360) % 360
    const landedIndex = Math.floor(landingAngle / sliceAngle) % sliceCount

    setResult({ index: landedIndex, prize: slices[landedIndex] })
    setSpinning(false)
  }

  // Build conic-gradient string for wheel background
  const gradStops = slices
    .map((s, i) => `${s.color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`)
    .join(', ')

  // labels positioned around the wheel
  const labels = slices.map((s, i) => {
    const angle = i * sliceAngle + sliceAngle / 2 // middle of slice
    return (
      <div
        key={i}
        className="absolute left-1/2 top-1/2 w-40 text-center transform -translate-x-1/2 -translate-y-full pointer-events-none"
        style={{
          transform: `rotate(${angle}deg) translateY(-${size / 2 - 36}px) rotate(${-angle}deg)`,
          width: (size * 0.5) + 'px'
        }}
      >
        <div className="text-sm font-semibold drop-shadow" style={{ fontFamily }}>{s.emoji} <span className="ml-1">{s.label}</span></div>
      </div>
    )
  })

  return (
    <div className="p-6 flex flex-col items-center gap-4" style={{ fontFamily }}>
      <h2 className="text-2xl font-bold">Harry Potter Event — Prize Wheel</h2>
      <div className="relative" style={{ width: size + 'px', height: size + 'px' }}>
        {/* Pointer */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-6 z-30 flex items-center flex-col">
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-yellow-400 shadow-md" />
          <div className="mt-2 text-xs">🪄 pointer</div>
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className={`rounded-full border-8 border-yellow-300 shadow-2xl flex items-center justify-center transition-transform duration-500 ease-out`}
          style={{
            width: size,
            height: size,
            background: `conic-gradient(from -90deg, ${gradStops})`,
            transform: `rotate(${rot}deg)`,
            transitionDuration: `${spinDuration}ms`
          }}
        >
          {/* center hub */}
          <div className="w-28 h-28 rounded-full bg-black/80 flex items-center justify-center text-center text-yellow-200 font-bold shadow-inner" style={{ fontFamily }}>
            <div>
              <div className="text-xs">Spin</div>
              <div className="text-sm">The Wheel</div>
            </div>
          </div>

          {/* labels */}
          {labels}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={spin}
          disabled={spinning}
          className={`px-6 py-2 rounded-full text-white font-bold shadow-lg ${spinning ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-amber-700 hover:scale-105 transform'}`}
        >
          {spinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>

        <button
          onClick={() => {
            setRot(0)
            setResult(null)
          }}
          className="px-4 py-2 rounded-full border border-yellow-300 text-yellow-800 font-semibold"
        >
          Reset
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 rounded-lg bg-black/80 text-yellow-200 shadow-md text-center" style={{ width: size + 'px' }}>
          <div className="text-lg font-extrabold">You won!</div>
          <div className="mt-2 text-2xl">{result.prize.emoji} {result.prize.label}</div>
          <div className="mt-1 text-sm opacity-80">Slice #{result.index + 1}</div>
        </div>
      )}

      <div className="mt-6 text-xs opacity-80 text-center max-w-xl">
        Tip: To use a Harry-Potter style font, add it to your <code>index.html</code> or import via @font-face and set the <code>fontFamily</code> prop.
      </div>
    </div>
  )
}

// Example usage (drop into App.jsx):
// import PrizeWheel from './HarryPotterPrizeWheel'
//

// <PrizeWheel prizes={prizes} size={420} spinDuration={5000} fontFamily={'HarryPotter, serif'} />
