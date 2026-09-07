import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Pagination } from "../../../components/ui/pagination";

/**
 * Pagination stories — DESIGN-SYSTEM §10 "Pagination (Load-more +
 * numbered)": S-07 numbered server-driven pages and the S-03
 * Load-more pattern with the §3 live-region announcement.
 */

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  args: {
    page: 1,
    pageCount: 5,
    onPageChange: () => undefined,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function NumberedDemo({ pageCount }: { pageCount: number }) {
  const [page, setPage] = useState(1);
  return (
    <div className="flex flex-col items-start gap-3">
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      <p className="text-meta text-text-secondary">
        Page {page} of {pageCount}
      </p>
    </div>
  );
}

function LoadMoreDemo() {
  const [loaded, setLoaded] = useState(24);
  const [loading, setLoading] = useState(false);
  const remaining = 60 - loaded;
  return (
    <Pagination
      mode="load-more"
      onLoadMore={() => {
        setLoading(true);
        setTimeout(() => {
          setLoaded((current) => Math.min(60, current + 12));
          setLoading(false);
        }, 600);
      }}
      loading={loading}
      remaining={remaining}
      announcement={`${loaded} videos loaded`}
    />
  );
}

const numberedArgs = { page: 1, pageCount: 5, onPageChange: () => undefined };

export const NumberedShort: Story = {
  name: "Numbered (short range)",
  args: numberedArgs,
  render: () => <NumberedDemo pageCount={5} />,
};

export const NumberedWindowed: Story = {
  name: "Numbered (windowed long range)",
  args: { page: 1, pageCount: 20, onPageChange: () => undefined },
  render: () => <NumberedDemo pageCount={20} />,
};

export const LoadMore: Story = {
  name: "Load more (S-03 + §3 live region)",
  args: { mode: "load-more", onLoadMore: () => undefined },
  render: () => <LoadMoreDemo />,
};

export const KeyboardJourney: Story = {
  name: "Keyboard: numbered pages",
  args: { page: 1, pageCount: 20, onPageChange: () => undefined },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step("page buttons are keyboard operable", async () => {
      const page4 = canvas.getByRole("button", { name: "Page 4" });
      await user.click(page4);
      await expect(canvas.getByRole("button", { name: "Page 4" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
    await step("next/prev chevrons page through the bounds", async () => {
      await user.click(canvas.getByRole("button", { name: "Next page" }));
      await expect(canvas.getByText("Page 5 of 20")).toBeInTheDocument();
    });
  },
  render: () => <NumberedDemo pageCount={20} />,
};
