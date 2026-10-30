'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

const TAGLINES = [
  "Helping humans advance technology solutions helping humans",
  "A commentary on human labor's role in the future after AI",
  "When you thought you were educated but that no longer matters",
  "Imagining humanity's resource usage at a Kardashev scale",
]

const ELLIPSIS_PARTS = [" ", ".", " ", ".", " ", "."]
const FRUSTRATIONS = [" argh", " ugh", " no", " nope", " wait"]

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

type Phase = "typing" | "ellipsis" | "pausing" | "frustration" | "deleting" | "gap"

export default function TaglineAnimation() {
  const [displayed, setDisplayed] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [phase, setPhase] = useState<Phase>("typing")
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [ellipsisIndex, setEllipsisIndex] = useState(0)
  const [frustrationText, setFrustrationText] = useState("")
  const [frustrationCharIndex, setFrustrationCharIndex] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(interval)
  }, [])

  // Phase 1: FRANTIC TYPING
  useEffect(() => {
    if (phase !== "typing") return
    const fullText = TAGLINES[taglineIndex]

    if (charIndex > fullText.length) {
      setEllipsisIndex(0)
      setPhase("ellipsis")
      return
    }

    const delay = Math.random() < 0.2 ? rand(150, 400) : rand(15, 40)
    timeoutRef.current = setTimeout(() => {
      setDisplayed(fullText.slice(0, charIndex))
      setCharIndex(c => c + 1)
    }, delay)

    return clear
  }, [phase, charIndex, taglineIndex, clear])

  // Phase 2: SLOW ELLIPSIS
  useEffect(() => {
    if (phase !== "ellipsis") return

    if (ellipsisIndex >= ELLIPSIS_PARTS.length) {
      setPhase("pausing")
      return
    }

    timeoutRef.current = setTimeout(() => {
      setDisplayed(prev => prev + ELLIPSIS_PARTS[ellipsisIndex])
      setEllipsisIndex(i => i + 1)
    }, rand(500, 800))

    return clear
  }, [phase, ellipsisIndex, clear])

  // Phase 3: PAUSE — then decide frustration or delete
  useEffect(() => {
    if (phase !== "pausing") return

    timeoutRef.current = setTimeout(() => {
      if (Math.random() < 0.35) {
        setFrustrationText(pick(FRUSTRATIONS))
        setFrustrationCharIndex(0)
        setPhase("frustration")
      } else {
        setPhase("deleting")
      }
    }, rand(1500, 2500))

    return clear
  }, [phase, clear])

  // Phase 4: FRUSTRATION — rapid outburst, then delete
  useEffect(() => {
    if (phase !== "frustration") return

    if (frustrationCharIndex >= frustrationText.length) {
      timeoutRef.current = setTimeout(() => setPhase("deleting"), 200)
      return clear
    }

    timeoutRef.current = setTimeout(() => {
      setDisplayed(prev => prev + frustrationText[frustrationCharIndex])
      setFrustrationCharIndex(i => i + 1)
    }, rand(15, 40))

    return clear
  }, [phase, frustrationCharIndex, frustrationText, clear])

  // Phase 5: DELETE — single chars and chunks
  useEffect(() => {
    if (phase !== "deleting") return

    if (displayed.length === 0) {
      setPhase("gap")
      return
    }

    const doChunk = Math.random() < 0.4
    const chunkSize = doChunk ? Math.min(rand(2, 4), displayed.length) : 1
    const delay = doChunk ? rand(30, 60) : rand(8, 20)

    timeoutRef.current = setTimeout(() => {
      setDisplayed(prev => prev.slice(0, -chunkSize))
    }, delay)

    return clear
  }, [phase, displayed, clear])

  // Phase 6: GAP — brief breath before next phrase
  useEffect(() => {
    if (phase !== "gap") return

    timeoutRef.current = setTimeout(() => {
      setTaglineIndex(i => (i + 1) % TAGLINES.length)
      setCharIndex(0)
      setDisplayed("")
      setPhase("typing")
    }, rand(200, 400))

    return clear
  }, [phase, taglineIndex, clear])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-4">
      <div style={{ flex: 1 }} />
      <div className="w-full max-w-[820px] flex flex-col items-center">
        <div className="w-[90%] relative">

          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Ultiwork"
            width={720}
            height={138}
            className="w-full h-auto"
            priority
          />

          {/* Tagline — absolutely positioned so growing text never shifts the logo */}
          <div className="absolute left-[10%]" style={{ top: '100%', width: '80%', paddingTop: '3.5rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-caveat)',
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                lineHeight: '1.35',
                color: '#ffffff',
                textShadow: '0 0 8px rgba(0,255,255,0.5), 0 0 20px rgba(0,255,255,0.3), 0 0 40px rgba(0,255,255,0.15)',
                margin: 0,
              }}
            >
              {displayed}
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
            </p>
          </div>

        </div>
      </div>
      {/* The tagline overflows the logo box; this floor keeps it clear of whatever follows the hero on short screens */}
      <div style={{ flex: 2, minHeight: '16rem' }} />
    </div>
  )
}
