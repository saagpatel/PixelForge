import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

describe("OperationsPanel crop controls", () => {
  beforeEach(() => {
    resetStore();
    useAppStore.setState({ imageInfo: baseImageInfo });
    Object.values(opsMock).forEach((fn) => fn.mockReset());
  });

  it("keeps crop dimensions inside the current image bounds", async () => {
    render(<OperationsPanel />);

    fireEvent.change(screen.getByLabelText("Crop X"), {
      target: { value: "750" },
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Crop Width")).toHaveValue(50);
    });

    expect(
      screen.getByText("Keep the crop inside 800 x 600. Width max: 50, height max: 600."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Apply Crop" }));

    expect(opsMock.crop).toHaveBeenCalledWith(750, 0, 50, 600);
  });
});
