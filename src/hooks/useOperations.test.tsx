import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "../stores/useAppStore";
import type { ImageInfo } from "../types/image";
import { useOperations } from "./useOperations";
import * as tauri from "../lib/tauri";

vi.mock("../lib/tauri", () => ({
  getAssetUrl: vi.fn((path: string) => `asset://${path}`),
  getImageInfo: vi.fn(),
  applyCrop: vi.fn(),
  applyResize: vi.fn(),
  applyRotate: vi.fn(),
  applyFlip: vi.fn(),
  applyBrightness: vi.fn(),
  applyContrast: vi.fn(),
  applyHue: vi.fn(),
  applySaturation: vi.fn(),
  applyLightness: vi.fn(),
  applyBlur: vi.fn(),
  applySharpen: vi.fn(),
}));

const baseImageInfo: ImageInfo = {
  width: 800,
  height: 600,
  format: "png",
  fileSizeBytes: 128_000,
  fileName: "original.png",
  filePath: "/tmp/original.png",
  needsConversion: false,
};

function resetStore() {
  useAppStore.setState({
    imageUrl: null,
    imageInfo: null,
    isLoading: false,
    error: null,
    originalFilePath: null,
    currentFilePath: null,
    operationHistory: [],
    isProcessing: false,
    operationProgress: null,
    activeSidebarPanel: null,
    beforeImageUrl: null,
    afterImageUrl: null,
    showBeforeAfter: false,
    inpaintMode: false,
    brushSize: 30,
    zoom: 1,
    panX: 0,
    panY: 0,
    theme: "system",
  });
}

describe("useOperations", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  it("refreshes metadata after a resize operation completes", async () => {
    vi.mocked(tauri.applyResize).mockResolvedValue("/tmp/resized.png");
    vi.mocked(tauri.getImageInfo).mockResolvedValue({
      ...baseImageInfo,
      width: 400,
      height: 300,
      fileName: "resized.png",
      filePath: "/tmp/resized.png",
      fileSizeBytes: 64_000,
    });

    useAppStore.setState({
      originalFilePath: baseImageInfo.filePath,
      currentFilePath: baseImageInfo.filePath,
      imageInfo: baseImageInfo,
    });

    const { result } = renderHook(() => useOperations());

    await act(async () => {
      await result.current.resize(400, 300, "lanczos");
    });

    expect(tauri.applyResize).toHaveBeenCalledWith(
      "/tmp/original.png",
      400,
      300,
      "lanczos",
    );
    expect(tauri.getImageInfo).toHaveBeenCalledWith("/tmp/resized.png");
    expect(useAppStore.getState().currentFilePath).toBe("/tmp/resized.png");
    expect(useAppStore.getState().imageUrl).toBe("asset:///tmp/resized.png");
    expect(useAppStore.getState().imageInfo).toMatchObject({
      filePath: "/tmp/resized.png",
      width: 400,
      height: 300,
    });
  });

  it("ignores new operations while the app is already busy", async () => {
    useAppStore.setState({
      currentFilePath: baseImageInfo.filePath,
      imageInfo: baseImageInfo,
      isProcessing: true,
    });

    const { result } = renderHook(() => useOperations());

    await act(async () => {
      await result.current.resize(400, 300, "lanczos");
    });

    expect(tauri.applyResize).not.toHaveBeenCalled();
    expect(useAppStore.getState().currentFilePath).toBe("/tmp/original.png");
  });
});
