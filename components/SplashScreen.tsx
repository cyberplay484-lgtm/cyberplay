import React, { useEffect, useState } from 'react';
import { CYBER_PLAY_LOGO_BASE64, LOGO_IMG_ALT } from '../assets/logo';

interface SplashScreenProps {
  onAnimationEnd: () => void;
}

const SPLASH_DISPLAY_DURATION_MS = 2000; // How long the logo stays visible and pulsing
const FADE_OUT_DURATION_MS = 1000; // How long the fade-out takes

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationEnd }) => {
  const [phase, setPhase] = useState<'initial' | 'fadeIn' | 'pulsing' | 'fadeOut'>('initial');

  useEffect(() => {
    // Phase 1: Small delay, then fade in
    const timer1 = setTimeout(() => {
      setPhase('fadeIn');
    }, 100); 

    // Phase 2: After fade in completes, start pulsing. This timing is critical.
    const timer2 = setTimeout(() => {
      setPhase('pulsing');
      
      // Phase 3: After pulsing for SPLASH_DISPLAY_DURATION_MS, start fade out
      const timer3 = setTimeout(() => {
        setPhase('fadeOut');
        
        // Phase 4: After fade out completes, notify parent
        const timer4 = setTimeout(() => {
          onAnimationEnd();
        }, FADE_OUT_DURATION_MS); 
        return () => clearTimeout(timer4);
      }, SPLASH_DISPLAY_DURATION_MS); 
      return () => clearTimeout(timer3);
    }, 500); // Duration for the fade-in animation to complete (matched with CSS transition duration)

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onAnimationEnd]);

  const getAnimationClasses = () => {
    switch (phase) {
      case 'initial':
        return 'opacity-0 scale-95'; 
      case 'fadeIn':
        return 'opacity-100 scale-100 transition-all duration-500 ease-out';
      case 'pulsing':
        return 'opacity-100 scale-100 animate-pulse-custom';
      case 'fadeOut':
        return 'opacity-0 scale-105 transition-all duration-1000 ease-in';
      default:
        return '';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      role="status"
      aria-label="Loading Cyber Play"
    >
      <img
        src={CYBER_PLAY_LOGO_BASE64}
        alt={LOGO_IMG_ALT}
        className={`max-w-[80vw] max-h-[80vh] w-96 h-auto object-contain ${getAnimationClasses()}`}
      />
    </div>
  );
};

export default SplashScreen;
