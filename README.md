# PixelForge

[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)](#) [![Rust](https://img.shields.io/badge/Rust-dea584?style=flat-square&logo=rust&logoColor=white)](#) [![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](#)

> A desktop image editor where the Rust backend does the heavy lifting and the AI tools actually work offline

PixelForge is a local-first desktop image editor built with Tauri 2, React 19, and Rust. Core adjustments (rotate, flip, resize, brightness, contrast, HSL, blur, sharpen) run through a Rust image pipeline for speed. AI tools — background removal, upscaling, inpainting, style transfer, and palette extraction — run locally without cloud calls.

## Features

- **Core adjustments** — rotate, flip, resize, brightness/contrast, HSL tuning, blur, and sharpen via a Rust-backed pipeline
- **AI background removal** — segment and remove backgrounds locally; no API key, no upload
- **AI upscaling** — super-resolution upscaling that preserves edge detail
- **AI inpainting** — fill or replace selected regions with context-aware generation
- **Style transfer and classification** — apply artistic styles and get scene labels from on-device models
- **Palette extraction** — pull a dominant color palette from any image for design work
- **Multi-format export** — save to PNG, JPEG, WebP, and other common formats

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+
- Rust 1.93+ (via [rustup](https://rustup.rs))
- macOS: Xcode Command Line Tools
- Linux: [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)
- Windows: Visual Studio Build Tools

### Installation

```bash
git clone https://github.com/saagpatel/PixelForge.git
cd PixelForge
bash .codex/setup.sh
```

Or manually:

```bash
pnpm install --frozen-lockfile
```

### Usage

```bash
# Development mode
pnpm tauri dev

# Low-disk mode (ephemeral build caches)
pnpm lean:dev

# Run tests (Rust + frontend)
pnpm test

# Production build
pnpm tauri build
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop shell | Tauri 2 |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| Image processing | Rust (image crate pipeline) |
| AI models | On-device inference (local) |
| Tests | Vitest + Rust unit tests |

## Architecture

Image data flows from the React canvas into the Rust backend via Tauri commands. Core transformations (resize, rotate, color adjustments) are pure Rust functions operating on raw pixel buffers — no round-trips through JavaScript. AI operations run as separate Rust tasks spawned with tokio, keeping the UI responsive during inference. The non-destructive edit history is maintained as a command stack in the frontend; Rust re-applies the full stack only when exporting.

## License

MIT
