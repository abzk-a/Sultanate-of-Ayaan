import * as THREE from 'three';

/**
 * Creates a procedural 8-fold Islamic geometric star tile pattern
 */
export function createIslamicStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base sandstone/marble background
  ctx.fillStyle = '#e8dcc4';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle marble grain
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(215, 195, 160, 0.15)' : 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x, y, 2, 2);
  }

  // Draw 8-pointed star tile grid
  const step = 128;
  for (let x = 0; x <= 512; x += step) {
    for (let y = 0; y <= 512; y += step) {
      drawStar8(ctx, x, y, 42, '#1b5e3f', '#d4af37'); // Emerald and Gold
      drawInterlockingRibbon(ctx, x, y, step);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function drawStar8(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  fillColor: string,
  strokeColor: string
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Outer gold circle
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.15, 0, Math.PI * 2);
  ctx.stroke();

  // Two intersecting squares rotated 45 deg to form 8-point star
  ctx.fillStyle = fillColor;
  for (let i = 0; i < 2; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 4);
    const s = radius * 1.4;
    ctx.fillRect(-s / 2, -s / 2, s, s);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-s / 2, -s / 2, s, s);
    ctx.restore();
  }

  // Center golden jewel rosette
  ctx.fillStyle = strokeColor;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawInterlockingRibbon(ctx: CanvasRenderingContext2D, x: number, y: number, step: number) {
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - step / 2, y);
  ctx.lineTo(x + step / 2, y);
  ctx.moveTo(x, y - step / 2);
  ctx.lineTo(x, y + step / 2);
  ctx.stroke();
}

/**
 * Sandstone cobblestone paving texture
 */
export function createCobblestoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base desert sand
  ctx.fillStyle = '#cbb892';
  ctx.fillRect(0, 0, 512, 512);

  // Draw irregular paver stones
  const rows = 16;
  const cols = 16;
  const w = 512 / cols;
  const h = 512 / rows;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (w / 2);
    for (let c = -1; c < cols + 1; c++) {
      const stoneX = c * w + offset;
      const stoneY = r * h;

      // Color variation in sandstone
      const tone = Math.floor(180 + Math.random() * 45);
      const toneB = Math.floor(140 + Math.random() * 30);
      ctx.fillStyle = `rgb(${tone + 10}, ${tone}, ${toneB})`;

      // Rounded rectangular stone
      ctx.beginPath();
      ctx.roundRect(stoneX + 2, stoneY + 2, w - 4, h - 4, 4);
      ctx.fill();

      // Stone shadow and mortar line
      ctx.strokeStyle = '#9e8965';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Ornate Islamic Royal Rug / Carpet texture
 */
export function createRoyalCarpetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Crimson red ground
  ctx.fillStyle = '#8b1e23';
  ctx.fillRect(0, 0, 512, 512);

  // Gold ornate border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 14;
  ctx.strokeRect(16, 16, 480, 480);

  ctx.strokeStyle = '#1a4329'; // emerald inner band
  ctx.lineWidth = 8;
  ctx.strokeRect(32, 32, 448, 448);

  // Central medallion
  ctx.save();
  ctx.translate(256, 256);
  ctx.fillStyle = '#1a4329';
  ctx.beginPath();
  ctx.arc(0, 0, 90, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Medallion star
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 4);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(-35, -35, 70, 70);
    ctx.restore();
  }

  ctx.fillStyle = '#8b1e23';
  ctx.beginPath();
  ctx.arc(0, 0, 25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Mashrabiya (wooden lattice window screen) texture
 */
export function createMashrabiyaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark walnut background
  ctx.fillStyle = '#2b1a10';
  ctx.fillRect(0, 0, 256, 256);

  // Geometric carved apertures
  ctx.fillStyle = '#0f0a07';
  const size = 32;
  for (let x = 0; x < 256; x += size) {
    for (let y = 0; y < 256; y += size) {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#5a3820';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
