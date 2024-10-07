'use client'

import { useState, useRef, useCallback, useEffect } from 'react';
import { BorderBeam } from '@/components/ui/border-beam'
import { Confetti } from '@/components/ui/confetti'
import BoxReveal from './ui/box-reveal';

export default function Announcement() {
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<any>(null);

  const fireConfetti = useCallback(() => {
    setShowConfetti(true);
    if (confettiRef.current) {
      confettiRef.current.fire({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        infinite: true,
        particleSize: 15
      });
    }
  }, []);

  useEffect(() => {
    // Fire confetti on component mount
    fireConfetti();
  }, [fireConfetti]);

  const handleClick = useCallback(() => {
    fireConfetti();
  }, [fireConfetti]);

  return (
    <>
      <BoxReveal><div className="sm:mb-8 flex justify-center lg:justify-start">
      <div
          className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 cursor-pointer flex items-center"
          onClick={handleClick}
        >
          <BorderBeam />
          <span className="relative flex h-3 w-3 mr-3 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          I am available to work.{' '}
        </div>
      </div></BoxReveal>
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