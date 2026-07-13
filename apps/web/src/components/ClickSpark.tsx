"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";

type ClickSparkProps = {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  children?: ReactNode;
};

type Spark = {
  x: number;
  y: number;
  angle: number;
  startTime: number;
};

function isJsdomRuntime() {
  return typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("jsdom");
}

export function ClickSpark({
  sparkColor = "#19b98d",
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 420,
  easing = "ease-out",
  extraScale = 1,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;

    if (!canvas || !parent) {
      return;
    }

    const motionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    if (!motionQuery) {
      reduceMotionRef.current = false;
    } else {
      reduceMotionRef.current = motionQuery.matches;
    }

    const syncReducedMotion = () => {
      reduceMotionRef.current = motionQuery?.matches ?? false;
      if (reduceMotionRef.current) {
        sparksRef.current = [];
      }
    };

    motionQuery?.addEventListener("change", syncReducedMotion);

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const nextWidth = Math.max(1, Math.floor(width * ratio));
      const nextHeight = Math.max(1, Math.floor(height * ratio));

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 80);
    };

    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(handleResize) : null;
    observer?.observe(parent);
    if (!observer) {
      window.addEventListener("resize", handleResize);
    }
    resizeCanvas();

    return () => {
      observer?.disconnect();
      if (!observer) {
        window.removeEventListener("resize", handleResize);
      }
      motionQuery?.removeEventListener("change", syncReducedMotion);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing],
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || isJsdomRuntime()) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationId = 0;

    const draw = (timestamp: number) => {
      const ratio = window.devicePixelRatio || 1;
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (!reduceMotionRef.current) {
        sparksRef.current = sparksRef.current.filter((spark) => {
          const elapsed = timestamp - spark.startTime;

          if (elapsed >= duration) {
            return false;
          }

          const eased = easeFunc(elapsed / duration);
          const distance = eased * sparkRadius * extraScale * ratio;
          const lineLength = sparkSize * (1 - eased) * ratio;
          const x = spark.x * ratio;
          const y = spark.y * ratio;
          const x1 = x + distance * Math.cos(spark.angle);
          const y1 = y + distance * Math.sin(spark.angle);
          const x2 = x + (distance + lineLength) * Math.cos(spark.angle);
          const y2 = y + (distance + lineLength) * Math.sin(spark.angle);

          context.strokeStyle = sparkColor;
          context.lineWidth = 2 * ratio;
          context.lineCap = "round";
          context.beginPath();
          context.moveTo(x1, y1);
          context.lineTo(x2, y2);
          context.stroke();

          return true;
        });
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [duration, easeFunc, extraScale, sparkColor, sparkRadius, sparkSize]);

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const canvas = canvasRef.current;

    if (!canvas || reduceMotionRef.current) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const now = performance.now();

    sparksRef.current.push(
      ...Array.from({ length: sparkCount }, (_, index) => ({
        x,
        y,
        angle: (2 * Math.PI * index) / sparkCount,
        startTime: now,
      })),
    );
  }

  return (
    <div className="relative" onClick={handleClick}>
      <canvas
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        ref={canvasRef}
      />
      {children}
    </div>
  );
}
