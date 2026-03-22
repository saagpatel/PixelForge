import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "../../stores/useAppStore";
import type { ImageInfo } from "../../types/image";
import { OperationsPanel } from "./OperationsPanel";

const opsMock = {
  crop: vi.fn(),
  resize: vi.fn(),
  rotate: vi.fn(),
  flip: vi.fn(),
  brightness: vi.fn(),
  contrast: vi.fn(),
  hue: vi.fn(),
  saturation: vi.fn(),
  lightness: vi.fn(),
  blur: vi.fn(),
  sharpen: vi.fn(),
};

vi.mock("../../hooks/useOperations", () => ({
  useOperations: () => opsMock,
}));

const baseImageInfo: ImageInfo = {
  width: 800,
  height: 600,
  format: "png",
  fileSizeBytes: 128_000,
  fileName: "sample.png",
  filePath: "/tmp/sample.png",
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

describe("OperationsPanel", () => {
  beforeEach(() => {
    resetStore();
    useAppStore.setState({ imageInfo: baseImageInfo });
    Object.values(opsMock).forEach((fn) => fn.mockReset());
  });

  it("triggers rotate actions from the quick controls", () => {
    render(<OperationsPanel />);

    fireEvent.click(screen.getByRole("button", { name: /^90$/ }));

    expect(opsMock.rotate).toHaveBeenCalledWith(90);
  });

  it("uses the current image size for resize by default", () => {
    render(<OperationsPanel />);

    fireEvent.click(screen.getByRole("button", { name: "Resize" }));

    expect(opsMock.resize).toHaveBeenCalledWith(800, 600, "lanczos");
  });
});
