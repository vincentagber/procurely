"use client";

import {
  motion,
  type MotionProps,
  type Transition,
  useReducedMotion,
} from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/format";

type RevealDirection = "up" | "down" | "left" | "right";

type RevealProps = Omit<
  MotionProps,
  "initial" | "whileInView" | "transition" | "viewport"
> & {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  distance?: number;
  scale?: number;
  blur?: number;
  amount?: number;
  once?: boolean;
  transition?: Transition;
};

function resolveOffset(direction: RevealDirection, distance: number) {
  switch (direction) {
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    case "up":
    default:
      return { x: 0, y: distance };
  }
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.75,
  direction = "up",
  distance = 36,
  scale = 0.98,
  blur = 10,
  amount = 0.18,
  once = true,
  transition,
  style,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = resolveOffset(direction, reduceMotion ? 0 : distance);
  const hiddenState = reduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale,
        filter: `blur(${blur}px)`,
      };
  const visibleState = reduceMotion
    ? { opacity: 1 }
    : {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      };
  const mergedTransition: Transition = {
    duration: reduceMotion ? Math.min(duration, 0.35) : duration,
    ease: [0.16, 1, 0.3, 1],
    delay,
    ...transition,
  };

  return (
    <motion.div
      className={cn(className)}
      initial={hiddenState}
      style={{ willChange: "transform, opacity, filter", ...style }}
      transition={mergedTransition}
      viewport={{ once, amount }}
      whileInView={visibleState}
      {...props}
    >
      {children}
    </motion.div>
  );
}
