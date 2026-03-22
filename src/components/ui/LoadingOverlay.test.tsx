import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LoadingOverlay } from "./LoadingOverlay";
import { useAppStore } from "../../stores/useAppStore";

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
  resetStore();
});

describe("LoadingOverlay", () => {
  it("renders nothing while idle", () => {
    const { container } = render(<LoadingOverlay />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders loading copy when an image is loading", () => {
    useAppStore.setState({ isLoading: true });

    render(<LoadingOverlay />);

    expect(screen.getByText("Loading image...")).toBeInTheDocument();
  });
});
