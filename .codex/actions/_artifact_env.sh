#!/usr/bin/env bash
set -euo pipefail

# codex-os-managed
REPO_ROOT="${CODEX_REPO_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
REPO_NAME="${CODEX_REPO_NAME:-$(basename "$REPO_ROOT")}" 
WORKTREE_ROOT="${CODEX_WORKTREE_ROOT:-$(cd "$REPO_ROOT" && pwd -P)}"

hash_key() {
  local value="$1"
  if command -v shasum >/dev/null 2>&1; then
    printf '%s' "$value" | shasum -a 256 | awk '{print substr($1,1,12)}'
  else
    printf '%s' "$value" | md5 | awk '{print substr($NF,1,12)}'
  fi
}

REPO_HASH="${CODEX_REPO_HASH:-$(hash_key "$REPO_ROOT")}"
WORKTREE_HASH="${CODEX_WORKTREE_HASH:-$(hash_key "$WORKTREE_ROOT")}"

RUN_ID="${CODEX_RUN_ID:-$(date +%Y%m%dT%H%M%S)-$$}"
if [[ -z "${CODEX_CACHE_ROOT:-}" ]]; then
  if [[ -n "${XDG_CACHE_HOME:-}" ]]; then
    CODEX_CACHE_ROOT="$XDG_CACHE_HOME/Codex"
  elif [[ "$(uname -s)" == "Darwin" ]]; then
    CODEX_CACHE_ROOT="$HOME/Library/Caches/Codex"
  else
    CODEX_CACHE_ROOT="$HOME/.cache/Codex"
  fi
fi
CODEX_BUILD_ROOT="${CODEX_BUILD_ROOT:-$CODEX_CACHE_ROOT/build}"
CODEX_LOG_ROOT="${CODEX_LOG_ROOT:-$CODEX_CACHE_ROOT/logs}"

export CODEX_REPO_ROOT="$REPO_ROOT"
export CODEX_REPO_NAME="$REPO_NAME"
export CODEX_REPO_HASH="$REPO_HASH"
export CODEX_WORKTREE_ROOT="$WORKTREE_ROOT"
export CODEX_WORKTREE_HASH="$WORKTREE_HASH"
export CODEX_RUN_ID="$RUN_ID"

export CODEX_BUILD_RUST_DIR="${CODEX_BUILD_RUST_DIR:-$CODEX_BUILD_ROOT/rust/$REPO_NAME/$WORKTREE_HASH}"
export CODEX_BUILD_NEXT_DIR="${CODEX_BUILD_NEXT_DIR:-$CODEX_BUILD_ROOT/next/$REPO_NAME/$WORKTREE_HASH}"
export CODEX_BUILD_JS_DIR="${CODEX_BUILD_JS_DIR:-$CODEX_BUILD_ROOT/js/$REPO_NAME/$WORKTREE_HASH}"
export CODEX_LOG_RUN_DIR="${CODEX_LOG_RUN_DIR:-$CODEX_LOG_ROOT/$REPO_NAME/$WORKTREE_HASH/$RUN_ID}"

mkdir -p "$CODEX_BUILD_RUST_DIR" "$CODEX_BUILD_NEXT_DIR" "$CODEX_BUILD_JS_DIR" "$CODEX_LOG_RUN_DIR"

if [[ -z "${CARGO_TARGET_DIR:-}" ]]; then
  export CARGO_TARGET_DIR="$CODEX_BUILD_RUST_DIR"
fi
if [[ -z "${NEXT_CACHE_DIR:-}" ]]; then
  export NEXT_CACHE_DIR="$CODEX_BUILD_NEXT_DIR"
fi
if [[ -z "${VITE_CACHE_DIR:-}" ]]; then
  export VITE_CACHE_DIR="$CODEX_BUILD_JS_DIR/vite"
fi
if [[ -z "${TURBO_CACHE_DIR:-}" ]]; then
  export TURBO_CACHE_DIR="$CODEX_BUILD_JS_DIR/turbo"
fi
