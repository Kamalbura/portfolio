'use client';

import { useLayoutEffect, type RefObject } from 'react';
import SplitType from 'split-type';
import gsap from 'gsap';

type SplitToken = 'chars' | 'words' | 'lines';
type SplitOptions = SplitToken[] | SplitToken;

type AnimationCallback = (elements: HTMLElement[]) => gsap.core.Timeline | void;

export function useSplitText(
  target: RefObject<HTMLElement>,
  types: SplitOptions = ['lines', 'words'],
  onAnimate?: AnimationCallback,
) {
  const signature = Array.isArray(types) ? types.join('-') : types;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!target.current) return;

    const split = new SplitType(target.current, { types });
    const elements: HTMLElement[] = [
      ...(split.lines ?? []),
      ...(split.words ?? []),
      ...(split.chars ?? []),
    ].filter(Boolean) as HTMLElement[];

    let timeline: gsap.core.Timeline | void;
    if (onAnimate && elements.length > 0) {
      timeline = onAnimate(elements);
    }

    return () => {
      timeline?.kill?.();
      split.revert();
    };
  }, [target, onAnimate, signature, types]);
}
