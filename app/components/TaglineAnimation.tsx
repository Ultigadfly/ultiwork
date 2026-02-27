'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const TAGLINES = [
  "Helping humans advance technology solutions helping humans",
  "A commentary on human labor's role in the future after AI",
  "When you thought you were educated but that no longer matters",
  "Imagining humanity's resource usage at a Kardashev scale",
]

const FRUSTRATIONS = [' argh', ' ugh', ' no', ' nope', ' wait']

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

export default function TaglineAnimation() {
  const [displayText, setDisplayText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const cancelledRef = useRef(false)

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Main animation loop
  useEffect(() => {
    cancelledRef.current = false
    let phraseIndex = 0

    async function animate() {
      while (!cancelledRef.current) {
        const phrase = TAGLINES[phraseIndex]

        // 1. FRANTIC TYPING — herky-jerky bursts
        for (let i = 0; i < phrase.length; i++) {
          if (cancelledRef.current) return
          setDisplayText(phrase.slice(0, i + 1))
          const delay = Math.random() < 0.12
            ? randomBetween(150, 420)  // occasional anxious pause mid-phrase
            : randomBetween(12, 45)    // rapid, erratic keystrokes
          await sleep(delay)
        }

        // 2. ELLIPSIS — slow and contemplative
        const ellipsisParts = [' ', '.', ' ', '.', ' ', '.']
        let ellipsis = ''
        for (const part of ellipsisParts) {
          if (cancelledRef.current) return
          ellipsis += part
          setDisplayText(phrase + ellipsis)
          await sleep(randomBetween(500, 850))
        }

        // 3. PAUSE — sitting back, staring at it
        if (cancelledRef.current) return
        await sleep(randomBetween(1500, 2600))

        // 4. FRUSTRATION — optional outburst (~35% chance)
        let fullText = phrase + ellipsis
        if (Math.random() < 0.35) {
          const outburst = FRUSTRATIONS[Math.floor(Math.random() * FRUSTRATIONS.length)]
          for (let i = 0; i < outburst.length; i++) {
            if (cancelledRef.current) return
            fullText = phrase + ellipsis + outburst.slice(0, i + 1)
            setDisplayText(fullText)
            await sleep(randomBetween(15, 40))
          }
          await sleep(randomBetween(150, 300))
        }

        // 5. RAPID DELETE — impatient, chunky
        let remaining = fullText
        while (remaining.length > 0) {
          if (cancelledRef.current) return
          // Mix single-char and chunk deletes
          const useChunk = Math.random() < 0.45
          const chunkSize = useChunk ? randomBetween(2, 5) : 1
          remaining = remaining.slice(0, Math.max(0, remaining.length - chunkSize))
          setDisplayText(remaining)
          const delay = useChunk ? randomBetween(20, 50) : randomBetween(6, 18)
          await sleep(delay)
        }

        // Brief breath
        await sleep(randomBetween(200, 400))

        phraseIndex = (phraseIndex + 1) % TAGLINES.length
      }
    }

    animate()

    return () => {
      cancelledRef.current = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[820px] flex flex-col items-center">

        {/* Logo — 90% of container width */}
        <div className="w-[90%] mb-14">
          <Image
            src="/logo.png"
            alt="Ultiwork"
            width={720}
            height={138}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Tagline — same container width, centered */}
        <div className="w-full text-center min-h-[3.5rem]">
          <span
            style={{
              fontFamily: 'var(--font-caveat)',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              color: '#ffffff',
              textShadow: '0 0 10px #00ffff, 0 0 22px rgba(0,255,255,0.25)',
            }}
          >
            {displayText}
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '0.85em',
                backgroundColor: '#ffffff',
                marginLeft: '2px',
                verticalAlign: 'middle',
                opacity: cursorVisible ? 1 : 0,
                transition: 'opacity 0.08s',
              }}
            />
          </span>
        </div>

      </div>
    </div>
  )
}
