import { act, render, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { listen } from "@tauri-apps/api/event";
import { getImageInfo } from "./lib/tauri";
import { useAppStore } from "./stores/useAppStore";
import type { ImageInfo, OperationProgress } from "./types/image";
import App from "./App";

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(),
}));

vi.mock("./lib/tauri", () => ({
  getImageInfo: vi.fn(),
}));

vi.mock("./hooks/useImageLoader", () => ({
  useImageLoader: () => ({
    openFileDialog: vi.fn(),
  }),
}));

vi.mock("./hooks/useKeyboardShortcuts", () => ({
  useKeyboardShortcuts: vi.fn(),
}));

vi.mock("./components/layout/MainLayout", () => ({
  MainLayout: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

vi.mock("./components/viewer/ImageCanvas", () => ({
  ImageCanvas: () => <div data-testid="image-canvas" />,
}));

vi.mock("./components/viewer/ImageInfo", () => ({
  ImageInfo: () => null,
}));

vi.mock("./components/viewer/BeforeAfterSlider", () => ({
  BeforeAfterSlider: () => null,
}));

vi.mock("./components/panels/OperationsPanel", () => ({
  OperationsPanel: () => null,
}));

vi.mock("./components/panels/AiPanel", () => ({
  AiPanel: () => null,
}));

vi.mock("./components/panels/ExportPanel", () => ({
  ExportPanel: () => null,
}));

vi.mock("./components/panels/BatchPanel", () => ({
  BatchPanel: () => null,
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

describe("App", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
    vi.mocked(listen).mockResolvedValue(() => {});
  });

  it("stores operation progress from the Tauri event stream", async () => {
    let progressHandler:
      | ((event: { payload: OperationProgress }) => void)
      | undefined;

    vi.mocked(listen).mockImplementation(async (_eventName, handler) => {
      progressHandler = handler as (event: { payload: OperationProgress }) => void;
      return () => {};
    });

    render(<App />);

    await waitFor(() => {
      expect(listen).toHaveBeenCalledWith(
        "operation-progress",
        expect.any(Function),
      );
    });

    act(() => {
      progressHandler?.({
        payload: { stage: "remove_background", percent: 42 },
      });
    });

    expect(useAppStore.getState().operationProgress).toEqual({
      stage: "remove_background",
      percent: 42,
    });
  });

  it("refreshes image info when the current file path changes", async () => {
    vi.mocked(getImageInfo).mockResolvedValue({
      ...baseImageInfo,
      width: 640,
      height: 480,
      fileName: "updated.png",
      filePath: "/tmp/updated.png",
      fileSizeBytes: 90_000,
    });

    useAppStore.setState({
      currentFilePath: "/tmp/updated.png",
      imageInfo: baseImageInfo,
    });

    render(<App />);

    await waitFor(() => {
      expect(getImageInfo).toHaveBeenCalledWith("/tmp/updated.png");
    });

    await waitFor(() => {
      expect(useAppStore.getState().imageInfo).toMatchObject({
        filePath: "/tmp/updated.png",
        width: 640,
        height: 480,
      });
    });
  });
});
