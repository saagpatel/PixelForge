#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$REPO_ROOT/.codex/actions/_artifact_env.sh"

echo "PixelForge local setup"
echo "Repo: $(basename "$REPO_ROOT")"
echo "OS: $(uname -s)"
echo "Arch: $(uname -m)"

if command -v node >/dev/null 2>&1; then
  echo "node: $(node -v)"
else
  echo "node: missing"
fi

if command -v pnpm >/dev/null 2>&1; then
  echo "pnpm: $(pnpm -v)"
else
  echo "pnpm: missing"
fi

if command -v rustc >/dev/null 2>&1; then
  echo "rustc: $(rustc --version)"
else
  echo "rustc: missing"
fi

if command -v cargo >/dev/null 2>&1; then
  echo "cargo: $(cargo --version)"
else
  echo "cargo: missing"
fi

if [[ "$(uname -s)" == "Darwin" && "$(uname -m)" != "arm64" ]]; then
  echo "warning: Apple Silicon is recommended; verify you are not running under x86 emulation."
fi

cd "$REPO_ROOT"
pnpm install --frozen-lockfile
cargo fetch --manifest-path src-tauri/Cargo.toml
