'use client';

import {
  forwardRef,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type BaseProps = {
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = BaseProps & {
  as?: 'button';
} & ButtonHTMLAttributes<HTMLButtonElement>;

type AnchorProps = BaseProps & {
  as: 'a';
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type MagneticButtonProps = ButtonProps | AnchorProps;

type ElementRef = HTMLButtonElement | HTMLAnchorElement;

const MagneticButton = forwardRef<ElementRef, MagneticButtonProps>((props, forwardedRef) => {
  const { as = 'button', className = '', children, onMouseEnter, onMouseLeave, ...rest } = props as MagneticButtonProps & {
    as: 'button' | 'a';
  };

  const nodeRef = useRef<HTMLElement | null>(null);
  const [hovered, setHovered] = useState(false);

  useGSAP(
    () => {
      const node = nodeRef.current;
      if (!node) return;
      if (typeof window === 'undefined') return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      const toX = gsap.quickTo(node, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.32)' });
      const toY = gsap.quickTo(node, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.32)' });

      const handleMove = (event: MouseEvent) => {
        const rect = node.getBoundingClientRect();
        const offsetX = event.clientX - (rect.left + rect.width / 2);
        const offsetY = event.clientY - (rect.top + rect.height / 2);

        toX(offsetX * 0.35);
        toY(offsetY * 0.35);
      };

      const reset = () => {
        toX(0);
        toY(0);
      };

      if (hovered) {
        node.addEventListener('mousemove', handleMove);
        node.addEventListener('mouseleave', reset);
      }

      return () => {
        node.removeEventListener('mousemove', handleMove);
        node.removeEventListener('mouseleave', reset);
      };
    },
    { dependencies: [hovered] },
  );

  const assignRef = (instance: HTMLElement | null) => {
    nodeRef.current = instance;
    if (typeof forwardedRef === 'function') {
      forwardedRef(instance as ElementRef | null);
    } else if (forwardedRef) {
      forwardedRef.current = instance as ElementRef | null;
    }
  };

  const sharedProps = {
    className: `relative inline-flex items-center justify-center hover-target transition-transform duration-300 ease-out ${className}`,
    onMouseEnter: (event: ReactMouseEvent<HTMLElement>) => {
      setHovered(true);
      onMouseEnter?.(event as never);
    },
    onMouseLeave: (event: ReactMouseEvent<HTMLElement>) => {
      setHovered(false);
      onMouseLeave?.(event as never);
    },
  };

  const assignAnchorRef = (instance: HTMLAnchorElement | null) => assignRef(instance);
  const assignButtonRef = (instance: HTMLButtonElement | null) => assignRef(instance);

  if (as === 'a') {
    return (
      <a
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        ref={assignAnchorRef}
        className={sharedProps.className}
        onMouseEnter={sharedProps.onMouseEnter}
        onMouseLeave={sharedProps.onMouseLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={(rest as ButtonHTMLAttributes<HTMLButtonElement>).type ?? 'button'}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      ref={assignButtonRef}
      className={sharedProps.className}
      onMouseEnter={sharedProps.onMouseEnter}
      onMouseLeave={sharedProps.onMouseLeave}
    >
      {children}
    </button>
  );
});

MagneticButton.displayName = 'MagneticButton';

export { MagneticButton };
