import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/core", () => ({
  convertFileSrc: (path: string) => `mock://${path}`,
}));

import { useAppStore } from "./useAppStore";

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

beforeEach(() => {
  globalThis.localStorage?.clear?.();
  document.documentElement.className = "";
  resetStore();
});

describe("useAppStore", () => {
  it("clears image-specific state when the image is cleared", () => {
    useAppStore.setState({
      imageUrl: "mock:///tmp/current.png",
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
      beforeImageUrl: "mock:///tmp/before.png",
      afterImageUrl: "mock:///tmp/after.png",
      showBeforeAfter: true,
      inpaintMode: true,
    });

    useAppStore.getState().clearImage();

    const state = useAppStore.getState();
    expect(state.imageUrl).toBeNull();
    expect(state.imageInfo).toBeNull();
    expect(state.currentFilePath).toBeNull();
    expect(state.operationHistory).toHaveLength(0);
    expect(state.showBeforeAfter).toBe(false);
    expect(state.inpaintMode).toBe(false);
  });

  it("toggles the active sidebar panel", () => {
    const state = useAppStore.getState();

    state.setSidebarPanel("operations");
    expect(useAppStore.getState().activeSidebarPanel).toBe("operations");

    useAppStore.getState().setSidebarPanel("operations");
    expect(useAppStore.getState().activeSidebarPanel).toBeNull();
  });

  it("restores the previous image path when undo runs", () => {
    const state = useAppStore.getState();

    state.setFilePaths("/tmp/original.png", "/tmp/original.png");
    state.pushOperation({
      type: "resize",
      label: "Resize",
      imagePath: "/tmp/step-1.png",
    });
    state.pushOperation({
      type: "rotate",
      label: "Rotate",
      imagePath: "/tmp/step-2.png",
    });

    useAppStore.getState().undo();

    expect(useAppStore.getState().currentFilePath).toBe("/tmp/step-1.png");
    expect(useAppStore.getState().imageUrl).toBe("mock:///tmp/step-1.png");
  });
});
