'use client'

import { useState, useRef, useCallback } from 'react';
import { BorderBeam } from '@/components/ui/border-beam'
import { Confetti } from '@/components/ui/confetti'

export default function Announcement() {
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<any>(null);

  const handleClick = useCallback(() => {
    setShowConfetti(true);
    if (confettiRef.current) {
      confettiRef.current.fire({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        infinite: true,
        particleSize: 15 // Increased particle size
      });
    }
  }, []);

  return (
    <>
      <div className="hidden sm:mb-8 sm:flex ">
        <div
          className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 cursor-pointer flex items-center"
          onClick={handleClick}
        >
          <BorderBeam />
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
          I am available to work.{' '}
        </div>
      </div>
      <Confetti
        ref={confettiRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        manualstart={true}
      />
    </>
  )
}