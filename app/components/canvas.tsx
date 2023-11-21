"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const colorArray = ["#0FC2C0", "#0CABA8", "#008F8C", "#015958", "#023535"];

class Circle {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  color: string;
  maxRadius: number;
  minRadius: number;
  constructor(x: number, y: number, radius: number, dx: number, dy: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.maxRadius = 50;
    this.minRadius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(ctx: CanvasRenderingContext2D, position: { x: number; y: number }) {
    if (this.x + this.radius > ctx.canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > ctx.canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    // add interactivity
    if (
      position.x - this.x < 40 &&
      position.x - this.x > -40 &&
      position.y - this.y < 40 &&
      position.y - this.y > -40
    ) {
      if (this.radius < this.maxRadius) {
        this.radius += 1;
      }
    } else if (this.radius > this.minRadius) {
      this.radius -= 1;
    }
    this.draw(ctx);
  }
}
const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCanvasSize = (canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const animationFrameId = useRef<number>();
  const circles = useRef<Circle[]>([]);

  let position = useMemo(() => {
    return {
      x: 0,
      y: 0,
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      position.x = e.clientX;
      position.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
  });

  const animate = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      animationFrameId.current = requestAnimationFrame(animate);
      circles.current.forEach((circle) => circle.update(ctx, position));
    }
  }, [position]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCanvasSize(canvas);
      animate();
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    for (let i = 0; i < 300; i++) {
      let radius = Math.random() * 5 + 1;
      let x = Math.random() * (window.innerWidth - radius * 2) + radius;
      let y = Math.random() * (window.innerHeight - radius * 2) + radius;
      let increaseX = Math.random() - 0.5;
      let increaseY = Math.random() - 0.5;
      circles.current.push(new Circle(x, y, radius, increaseX, increaseY));
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        setCanvasSize(canvas);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Canvas;
