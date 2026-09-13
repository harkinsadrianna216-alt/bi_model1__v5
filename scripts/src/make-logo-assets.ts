// Generates the small logo variants each app actually serves (header mark,
// favicon, apple-touch icon, og image, tray icon) from the 1024x1024 brand
// masters in `assets/brand/`.
//
// Why this exists: shipping the 1024px master as the header logo meant ~800 KB
// on every page load. The masters stay the source of truth; this script derives
// every sized-down file. It is dependency-free (PNG decoded/re-encoded with
// Node's zlib), so it runs anywhere the workspace runs:
//
//   pnpm --filter @workspace/scripts run logo:assets
//
// Re-run it whenever a master in `assets/brand/` changes.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(scriptDir, "..", "..");
const MASTER_DIR = path.join(ROOT, "assets", "brand");

/** The desktop agent's mark — Creator Den runs the same one. */
const AGENT_MASTER = "nexet-agent-logo.png";

/**
 * Each front end under nexet.co, the master it draws its mark from, and the
 * filename it serves that mark under. The dens keep their own identities, so
 * Creator Den runs the desktop agent's mark and Authors Den has its own.
 */
const WEB_APPS: { app: string; master: string; served: string; og?: boolean }[] = [
  { app: "nexet", master: "nexet-logo.png", served: "nexet-logo.png", og: true },
  { app: "creators-den", master: AGENT_MASTER, served: "nexet-agent-logo.png" },
  { app: "authors-den", master: "nexet-author-den-logo.png", served: "nexet-author-den-logo.png" },
  { app: "oracle-admin", master: "nexet-logo.png", served: "nexet-logo.png" },
];

interface Raster {
  width: number;
  height: number;
  /** RGBA, 4 bytes per pixel, non-premultiplied. */
  data: Buffer;
}

// ---------------------------------------------------------------------------
// PNG decode (8-bit, non-interlaced, RGB or RGBA — what Picsart exports)
// ---------------------------------------------------------------------------
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

function unfilter(type: number, line: Buffer, prev: Buffer, bpp: number): void {
  for (let i = 0; i < line.length; i++) {
    const x = line[i];
    const a = i >= bpp ? line[i - bpp] : 0;
    const b = prev[i];
    const c = i >= bpp ? prev[i - bpp] : 0;
    switch (type) {
      case 0:
        break;
      case 1:
        line[i] = (x + a) & 0xff;
        break;
      case 2:
        line[i] = (x + b) & 0xff;
        break;
      case 3:
        line[i] = (x + ((a + b) >> 1)) & 0xff;
        break;
      case 4:
        line[i] = (x + paeth(a, b, c)) & 0xff;
        break;
      default:
        throw new Error(`Unsupported PNG filter type ${type}`);
    }
  }
}

function decodePng(buf: Buffer): Raster {
  if (buf.length < 8 || !buf.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("Not a PNG file");
  }
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat: Buffer[] = [];
  let offset = 8;
  while (offset + 8 <= buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    const start = offset + 8;
    const data = buf.subarray(start, start + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset = start + length + 4;
  }
  if (bitDepth !== 8) throw new Error(`Unsupported PNG bit depth ${bitDepth}`);
  if (interlace !== 0) throw new Error("Interlaced PNGs are not supported");
  if (colorType !== 2 && colorType !== 6) {
    throw new Error(`Unsupported PNG color type ${colorType} (need RGB or RGBA)`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(width * height * 4);
  const line = Buffer.alloc(stride);
  const prev = Buffer.alloc(stride);
  let pos = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[pos];
    pos += 1;
    raw.copy(line, 0, pos, pos + stride);
    pos += stride;
    unfilter(filter, line, prev, channels);
    for (let x = 0; x < width; x++) {
      const src = x * channels;
      const dst = (y * width + x) * 4;
      out[dst] = line[src];
      out[dst + 1] = line[src + 1];
      out[dst + 2] = line[src + 2];
      out[dst + 3] = channels === 4 ? line[src + 3] : 0xff;
    }
    line.copy(prev);
  }
  return { width, height, data: out };
}

// ---------------------------------------------------------------------------
// PNG encode
// ---------------------------------------------------------------------------
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typed = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typed, data])), 0);
  return Buffer.concat([length, typed, data, crc]);
}

function isOpaque(image: Raster): boolean {
  for (let i = 3; i < image.data.length; i += 4) {
    if (image.data[i] !== 0xff) return false;
  }
  return true;
}

/** Pick the cheapest PNG filter per scanline (the standard libpng heuristic:
 *  lowest sum of absolute signed deltas). Worth it — these marks are smooth
 *  gradients, and None-filtered rows compress several times worse. */
function encodeScanlines(image: Raster, channels: number): Buffer {
  const bpp = channels;
  const stride = image.width * channels;
  const out = Buffer.alloc((stride + 1) * image.height);
  const row = Buffer.alloc(stride);
  const prev = Buffer.alloc(stride);
  const candidate = Buffer.alloc(stride);
  const chosen = Buffer.alloc(stride);
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const src = (y * image.width + x) * 4;
      const dst = x * channels;
      row[dst] = image.data[src];
      row[dst + 1] = image.data[src + 1];
      row[dst + 2] = image.data[src + 2];
      if (channels === 4) row[dst + 3] = image.data[src + 3];
    }
    let bestScore = Number.POSITIVE_INFINITY;
    let bestType = 0;
    for (let type = 0; type <= 4; type++) {
      let score = 0;
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? row[i - bpp] : 0;
        const b = prev[i];
        const c = i >= bpp ? prev[i - bpp] : 0;
        const predictor =
          type === 0 ? 0 : type === 1 ? a : type === 2 ? b : type === 3 ? (a + b) >> 1 : paeth(a, b, c);
        const value = (row[i] - predictor) & 0xff;
        candidate[i] = value;
        score += value < 128 ? value : 256 - value;
      }
      if (score < bestScore) {
        bestScore = score;
        bestType = type;
        candidate.copy(chosen);
      }
    }
    const rowStart = y * (stride + 1);
    out[rowStart] = bestType;
    chosen.copy(out, rowStart + 1);
    row.copy(prev);
  }
  return out;
}

function encodePng(image: Raster): Buffer {
  // Drop the alpha channel entirely when the image is fully opaque — 25% fewer
  // bytes, and deflate does better without a constant plane.
  const opaque = isOpaque(image);
  const channels = opaque ? 3 : 4;
  const raw = encodeScanlines(image, channels);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(image.width, 0);
  ihdr.writeUInt32BE(image.height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = opaque ? 2 : 6; // color type: truecolor / truecolor+alpha
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  return Buffer.concat([
    PNG_SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Trim the transparent padding around the mark
// ---------------------------------------------------------------------------
// Both brand masters are a circular mark floating on a transparent 1024px
// canvas (the mark itself is ~695px). Trimming to a centred square lets the
// circle fill the round slots it renders in, instead of appearing small or
// getting its edges cropped by `object-fit`.
function trimToSquare(img: Raster, threshold = 8): Raster {
  let minX = img.width;
  let minY = img.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      if (img.data[(y * img.width + x) * 4 + 3] <= threshold) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0 || maxY < 0) return img;
  const side = Math.max(maxX - minX + 1, maxY - minY + 1);
  const left = Math.round((minX + maxX + 1) / 2 - side / 2);
  const top = Math.round((minY + maxY + 1) / 2 - side / 2);
  const out = Buffer.alloc(side * side * 4);
  for (let y = 0; y < side; y++) {
    const sy = top + y;
    if (sy < 0 || sy >= img.height) continue;
    for (let x = 0; x < side; x++) {
      const sx = left + x;
      if (sx < 0 || sx >= img.width) continue;
      const src = (sy * img.width + sx) * 4;
      const dst = (y * side + x) * 4;
      out[dst] = img.data[src];
      out[dst + 1] = img.data[src + 1];
      out[dst + 2] = img.data[src + 2];
      out[dst + 3] = img.data[src + 3];
    }
  }
  return { width: side, height: side, data: out };
}

// ---------------------------------------------------------------------------
// Downscale (area average, alpha-weighted so transparent edges don't darken)
// ---------------------------------------------------------------------------
function resize(src: Raster, size: number): Raster {
  const out = Buffer.alloc(size * size * 4);
  for (let dy = 0; dy < size; dy++) {
    const sy0 = (dy * src.height) / size;
    const sy1 = ((dy + 1) * src.height) / size;
    const y0 = Math.floor(sy0);
    const y1 = Math.min(src.height, Math.ceil(sy1));
    for (let dx = 0; dx < size; dx++) {
      const sx0 = (dx * src.width) / size;
      const sx1 = ((dx + 1) * src.width) / size;
      const x0 = Math.floor(sx0);
      const x1 = Math.min(src.width, Math.ceil(sx1));
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let weightSum = 0;
      for (let y = y0; y < y1; y++) {
        const wy = Math.min(y + 1, sy1) - Math.max(y, sy0);
        if (wy <= 0) continue;
        for (let x = x0; x < x1; x++) {
          const wx = Math.min(x + 1, sx1) - Math.max(x, sx0);
          const w = wx * wy;
          if (w <= 0) continue;
          const i = (y * src.width + x) * 4;
          const alpha = src.data[i + 3] / 255;
          r += src.data[i] * alpha * w;
          g += src.data[i + 1] * alpha * w;
          b += src.data[i + 2] * alpha * w;
          a += src.data[i + 3] * w;
          weightSum += w;
        }
      }
      const dst = (dy * size + dx) * 4;
      const alphaAvg = a / weightSum;
      const unPremultiply = alphaAvg > 0 ? 255 / (alphaAvg * weightSum) : 0;
      out[dst] = Math.min(255, Math.round(r * unPremultiply));
      out[dst + 1] = Math.min(255, Math.round(g * unPremultiply));
      out[dst + 2] = Math.min(255, Math.round(b * unPremultiply));
      out[dst + 3] = Math.min(255, Math.round(alphaAvg));
    }
  }
  return { width: size, height: size, data: out };
}

// ---------------------------------------------------------------------------
// Variant table
// ---------------------------------------------------------------------------
/** Header/brand mark: h-9 (36px) needs 108px at 3x, so 128 is comfortably sharp. */
const WEB_LOGO = 128;
const FAVICON = 32;
const APPLE_TOUCH = 180;
const OG_IMAGE = 512;
/** Agent window header (46px) and widget bubble (50px) both top out near 100px. */
const AGENT_LOGO = 192;
const AGENT_TRAY = 32;

function writePng(target: string, image: Raster): void {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, encodePng(image));
  console.log(`${path.relative(ROOT, target)}  ${image.width}x${image.height}  ${(fs.statSync(target).size / 1024).toFixed(1)} KB`);
}

function main(): void {
  // Masters are decoded once and trimmed to the mark, then shared by every
  // app that serves them.
  const marks = new Map<string, Raster>();
  const mark = (name: string): Raster => {
    const cached = marks.get(name);
    if (cached) return cached;
    const trimmed = trimToSquare(decodePng(fs.readFileSync(path.join(MASTER_DIR, name))));
    marks.set(name, trimmed);
    return trimmed;
  };

  for (const target of WEB_APPS) {
    const art = mark(target.master);
    const dir = path.join(ROOT, "artifacts", target.app, "public");
    writePng(path.join(dir, target.served), resize(art, WEB_LOGO));
    writePng(path.join(dir, "favicon-32.png"), resize(art, FAVICON));
    writePng(path.join(dir, "apple-touch-icon.png"), resize(art, APPLE_TOUCH));
    if (target.og) {
      writePng(path.join(dir, "og-logo.png"), resize(art, OG_IMAGE));
    }
  }

  const agentDir = path.join(ROOT, "artifacts", "desktop-agent", "assets");
  const agentArt = mark(AGENT_MASTER);
  writePng(path.join(agentDir, "nexet-agent-logo.png"), resize(agentArt, AGENT_LOGO));
  writePng(path.join(agentDir, "nexet-agent-tray.png"), resize(agentArt, AGENT_TRAY));
  // electron-builder reads this for the installer / app icon — keep it at the
  // master resolution (copied verbatim, never re-encoded).
  const iconPath = path.join(agentDir, "nexet-agent-icon.png");
  const agentMasterPath = path.join(MASTER_DIR, AGENT_MASTER);
  fs.mkdirSync(agentDir, { recursive: true });
  fs.copyFileSync(agentMasterPath, iconPath);
  console.log(
    `${path.relative(ROOT, iconPath)}  ${(fs.statSync(iconPath).size / 1024).toFixed(1)} KB  (master, copied verbatim)`,
  );
}

main();
