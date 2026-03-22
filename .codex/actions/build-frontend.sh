#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$REPO_ROOT/.codex/actions/_artifact_env.sh"

cd "$REPO_ROOT"
pnpm build
