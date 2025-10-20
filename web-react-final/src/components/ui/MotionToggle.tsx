"use client";

import { useMotionPreference } from '@/context/MotionPreferenceContext';

export default function MotionToggle() {
  const { preference, isOverrideActive, setPreference } = useMotionPreference();

  const isOn = preference === 'motion' || (!isOverrideActive && typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  return (
    <button
      onClick={() => setPreference(isOn ? 'reduce' : 'motion')}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={isOn ? 'Disable animations' : 'Enable animations'}
      title={isOn ? 'Disable animations' : 'Enable animations'}
    >
      {isOn ? (
        <span className="text-xs font-medium">Anim On</span>
      ) : (
        <span className="text-xs font-medium">Anim Off</span>
      )}
    </button>
  );
}
