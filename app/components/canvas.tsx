"use client";
import { useCallback, useEffect, useRef } from "react";

class Circle {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  constructor(x: number, y: number, radius: number, dx: number, dy: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.stroke();
  }

  update(ctx: CanvasRenderingContext2D) {
    if (this.x + this.radius > ctx.canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > ctx.canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
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

  const animate = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      animationFrameId.current = requestAnimationFrame(animate);
      circles.current.forEach((circle) => circle.update(ctx));
    }
  }, []);

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
    let radius = 40;
    for (let i = 0; i < 50; i++) {
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
