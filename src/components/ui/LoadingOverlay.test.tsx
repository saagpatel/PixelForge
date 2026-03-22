import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LoadingOverlay } from "./LoadingOverlay";
import { useAppStore } from "../../stores/useAppStore";

beforeEach(() => {
  useAppStore.setState({
    isLoading: false,
    isProcessing: false,
    operationProgress: null,
  });
});

describe("LoadingOverlay", () => {
  it("renders loading copy when an image is loading", () => {
    useAppStore.setState({ isLoading: true });

    render(<LoadingOverlay />);

    expect(screen.getByText("Loading image...")).toBeInTheDocument();
  });

  it("renders operation progress details for AI work", () => {
    useAppStore.setState({
      isProcessing: true,
      operationProgress: { stage: "loading_model", percent: 25 },
    });

    render(<LoadingOverlay />);

    expect(screen.getByText("Loading Model")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
  });
});
