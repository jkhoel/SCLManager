import "@testing-library/jest-dom";
import { render, screen, expect } from "@testing-library/react";
import { describe, it } from "node:test";

import {} from "@tauri-apps/api/mocks";

import Page from "../../app/page";

describe("Page", () => {
  it("renders the main element", () => {
    render(<Page />);

    const element = screen.getByRole("main");

    expect(element).toBeInTheDocument();
  });
});
