import { cx } from "@/lib/utils";
import { RiArrowDownSFill, RiArrowRightSFill, RiArrowUpSFill } from "@remixicon/react";

type BadgeColor = "success" | "error" | "neutral";

export function Badge1({ color, label }: { color: BadgeColor; label: string }) {
  const Icon = color === "success" ? RiArrowUpSFill : color === "error" ? RiArrowDownSFill : RiArrowRightSFill;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-x-1 rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ring-gray-200 dark:ring-gray-800",
        color === "success"
          ? "text-emerald-700 dark:text-emerald-500"
          : color === "error"
          ? "text-red-700  dark:text-red-500"
          : "text-gray-700 dark:text-gray-400"
      )}
    >
      {Icon && <Icon className="-ml-0.5 size-4" aria-hidden={true} />}
      {label}
    </span>
  );
}

export function Badge2({ color, label }: { color: BadgeColor; label: string }) {
  const Icon = color === "success" ? RiArrowUpSFill : color === "error" ? RiArrowDownSFill : RiArrowRightSFill;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-x-1 rounded-md px-2 py-1 text-xs font-semibold",
        color === "success"
          ? "text-emerald-800 bg-emerald-100 dark:bg-emerald-400/20 dark:text-emerald-500"
          : color === "error"
          ? "text-red-800 bg-red-100 dark:bg-red-400/20 dark:text-red-500"
          : "text-gray-700 bg-gray-200/50 dark:bg-gray-500/30 dark:text-gray-300"
      )}
    >
      {Icon && <Icon className="-ml-0.5 size-4" aria-hidden={true} />}
      {label}
    </span>
  );
}

export function Badge3({ color, label }: { color: BadgeColor; label: string }) {
  const Icon = color === "success" ? RiArrowUpSFill : color === "error" ? RiArrowDownSFill : RiArrowRightSFill;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-x-1 rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset",
        color === "success"
          ? "bg-emerald-50 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-400/20 dark:text-emerald-500 dark:ring-emerald-400/20"
          : color === "error"
          ? "bg-red-50 text-red-800 ring-red-600/20 dark:bg-red-400/20 dark:text-red-500 dark:ring-red-400/20"
          : "bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-500/30 dark:text-gray-300 dark:ring-gray-400/20"
      )}
    >
      {Icon && <Icon className="-ml-0.5 size-4" aria-hidden={true} />}
      {label}
    </span>
  );
}

export function Badge4({ color, label }: { color: BadgeColor; label: string }) {
  const Icon = color === "success" ? RiArrowUpSFill : color === "error" ? RiArrowDownSFill : RiArrowRightSFill;

  return (
    <span className="inline-flex items-center space-x-2.5 rounded-lg bg-white py-1 pl-2.5 pr-1 ring-1 ring-inset ring-gray-200 dark:bg-gray-950 dark:ring-gray-800">
      <span
        className={cx(
          "text-xs font-semibold",
          color === "success"
            ? "text-emerald-700 dark:text-emerald-500"
            : color === "error"
            ? "text-red-700 dark:text-red-500"
            : "text-gray-700 dark:text-gray-300"
        )}
      >
        {label}
      </span>
      <span
        className={cx(
          "text-xs rounded-md px-2 py-1 font-medium",
          color === "success"
            ? "bg-emerald-100 dark:bg-emerald-400/20"
            : color === "error"
            ? "bg-red-100 dark:bg-red-400/20"
            : "bg-gray-200 dark:bg-gray-400/20"
        )}
      >
        {Icon && (
          <Icon
            className={cx(
              "size-4",
              color === "success"
                ? "text-emerald-800 dark:text-emerald-600"
                : color === "error"
                ? "text-red-800 dark:text-red-600"
                : "text-gray-700 dark:text-gray-300"
            )}
            aria-hidden={true}
          />
        )}
      </span>
    </span>
  );
}
