import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "./useAppStore";

beforeEach(() => {
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
  globalThis.localStorage?.clear?.();
});

describe("useAppStore", () => {
  it("clears processing progress when an error is set", () => {
    useAppStore.setState({
      isProcessing: true,
      operationProgress: { stage: "preprocessing", percent: 25 },
    });

    useAppStore.getState().setError("Boom");

    expect(useAppStore.getState().error).toBe("Boom");
    expect(useAppStore.getState().isProcessing).toBe(false);
    expect(useAppStore.getState().operationProgress).toBeNull();
  });

  it("clears image-specific state when the image is cleared", () => {
    useAppStore.setState({
      imageUrl: "asset://current.png",
      imageInfo: {
        width: 100,
        height: 80,
        format: "png",
        fileSizeBytes: 42,
        fileName: "current.png",
        filePath: "/tmp/current.png",
        needsConversion: false,
      },
      originalFilePath: "/tmp/original.png",
      currentFilePath: "/tmp/current.png",
      operationHistory: [
        { type: "resize", label: "Resize", imagePath: "/tmp/current.png" },
      ],
      operationProgress: { stage: "complete", percent: 100 },
      beforeImageUrl: "asset://before.png",
      afterImageUrl: "asset://after.png",
      showBeforeAfter: true,
      inpaintMode: true,
    });

    useAppStore.getState().clearImage();

    const state = useAppStore.getState();
    expect(state.imageUrl).toBeNull();
    expect(state.imageInfo).toBeNull();
    expect(state.currentFilePath).toBeNull();
    expect(state.operationHistory).toHaveLength(0);
    expect(state.operationProgress).toBeNull();
    expect(state.showBeforeAfter).toBe(false);
    expect(state.inpaintMode).toBe(false);
  });
});
