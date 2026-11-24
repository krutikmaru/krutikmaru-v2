"use client";

import {
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  safePolygon,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStatus,
  type ElementProps,
} from "@floating-ui/react";
import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

const ARROW_WIDTH = 20;
const ARROW_HEIGHT = 8;
// Minimum gap kept between the tooltip and the viewport edges.
const VIEWPORT_PADDING = 12;
// Points up with its base on the bottom of a 20×20 box (FloatingArrow rotates it per side). The base flares out
// flat so the arrow melts into the tooltip's edge instead of meeting it at a corner.
const ARROW_PATH =
  "M0,20 C4.5,20 7.6,16.8 8.6,14 Q10,10 11.4,14 C12.4,16.8 15.5,20 20,20 Z";

type TooltipProps = {
  /** Rendered inside the tooltip, which is a flex column: children that may shrink should allow it. */
  content: ReactNode;
  children: ReactNode;
  /** Applied to the trigger. */
  className?: string;
  /**
   * Set when the content has controls. A tooltip can't hold focus, so it then opens as a non-modal dialog that
   * keyboard users can Tab into, and the trigger becomes a button (unless it's a link).
   */
  interactive?: boolean;
  /** Accessible name of the interactive dialog. */
  label?: string;
  /**
   * Makes the trigger a link, opened in a new tab. A click follows it straight away, since hover or focus has
   * already shown the tooltip; a tap shows the tooltip first and follows the link on the next tap.
   */
  href?: string;
};

// Keeps the tap that opens a linked trigger's tooltip from also following the link. Listed after useClick, so its
// click handler runs once useClick has opened the tooltip, while `open` is still the value from before the tap.
function useTapToPreview(open: boolean, enabled: boolean): ElementProps {
  // The pointer behind the trigger's next click; cleared by a key press, as a click from Enter has none.
  const pointerType = useRef<string | undefined>(undefined);
  return useMemo(
    () =>
      enabled
        ? {
            reference: {
              onPointerDown(event) {
                pointerType.current = event.pointerType;
              },
              onKeyDown() {
                pointerType.current = undefined;
              },
              onClick(event) {
                if (!open && pointerType.current === "touch") event.preventDefault();
              },
            },
          }
        : {},
    [open, enabled],
  );
}

export function Tooltip({
  content,
  children,
  className,
  interactive = false,
  label,
  href,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  // Whether a press that started inside the tooltip is still held, e.g. while dragging the carousel.
  const [pressedInside, setPressedInside] = useState(false);

  const {
    refs: { setReference, setFloating },
    elements,
    floatingStyles,
    context,
    placement,
    middlewareData,
  } = useFloating({
    open,
    onOpenChange(nextOpen, _event, reason) {
      // A drag that starts inside can wander out of the tooltip; don't let that close it mid-drag.
      const hoverOut = reason === "hover" || reason === "safe-polygon";
      if (!nextOpen && hoverOut && pressedInside) return;
      setOpen(nextOpen);
    },
    placement: "bottom",
    // Position with top/left so the open animation can use `scale` and `translate` without compounding a transform.
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(ARROW_HEIGHT + 3),
      flip({ padding: VIEWPORT_PADDING }),
      shift({ padding: VIEWPORT_PADDING, limiter: limitShift() }),
      size({
        padding: VIEWPORT_PADDING,
        apply({ availableWidth, availableHeight, elements }) {
          const { style } = elements.floating;
          style.setProperty("--available-width", `${Math.max(0, availableWidth)}px`);
          style.setProperty("--available-height", `${Math.max(0, availableHeight)}px`);
        },
      }),
      // Keeps the arrow clear of the rounded corners.
      arrow({ element: arrowElement, padding: 28 }),
      hide(),
    ],
  });

  // Mouse opens it on hover, keyboard on focus-visible, and touch on tap (useClick ignores the mouse).
  const hover = useHover(context, {
    mouseOnly: true,
    delay: { open: 150 },
    handleClose: safePolygon(),
  });
  const focus = useFocus(context);
  const click = useClick(context, { ignoreMouse: true });
  const tapToPreview = useTapToPreview(open, !!href);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: interactive ? "dialog" : "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    tapToPreview,
    dismiss,
    role,
  ]);

  const { isMounted, status } = useTransitionStatus(context, {
    duration: { open: 400, close: 150 },
  });

  const side = placement.split("-")[0];
  const arrowX = middlewareData.arrow?.x;

  function isInside(target: EventTarget | null) {
    return (
      target instanceof Node &&
      (!!elements.floating?.contains(target) || !!elements.domReference?.contains(target))
    );
  }

  function handlePointerDown() {
    setPressedInside(true);
    const controller = new AbortController();
    const release = (event: PointerEvent) => {
      controller.abort();
      setPressedInside(false);
      if (!isInside(document.elementFromPoint(event.clientX, event.clientY)))
        setOpen(false);
    };
    addEventListener("pointerup", release, { signal: controller.signal });
    addEventListener("pointercancel", release, { signal: controller.signal });
  }

  function handleKeyDown(event: KeyboardEvent) {
    // Focus inside would otherwise drop to <body> when Escape unmounts the dialog.
    if (event.key === "Escape" && elements.floating?.contains(document.activeElement)) {
      (elements.domReference as HTMLElement | null)?.focus();
    }
  }

  const triggerProps = getReferenceProps();

  return (
    <>
      {href ? (
        <a
          ref={setReference}
          href={href}
          target="_blank"
          rel="noopener"
          draggable={false}
          data-open={open || undefined}
          className={className}
          {...triggerProps}
        >
          {children}
        </a>
      ) : (
        <span
          ref={setReference}
          tabIndex={0}
          role={interactive ? "button" : undefined}
          data-open={open || undefined}
          className={className}
          {...triggerProps}
        >
          {children}
        </span>
      )}
      {isMounted && (
        <FloatingPortal>
          {/* Hover must not steal focus, so nothing is focused on open; keyboard users Tab in from the trigger. */}
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={-1}
            returnFocus={false}
            disabled={!interactive}
          >
            <div
              ref={setFloating}
              data-status={status}
              data-side={side}
              style={{
                ...floatingStyles,
                visibility: middlewareData.hide?.referenceHidden ? "hidden" : undefined,
                transformOrigin: `${arrowX != null ? `${arrowX + ARROW_WIDTH / 2}px` : "50%"} ${side === "top" ? "100%" : "0"}`,
              }}
              className="bg-popover-background border-popover-border text-description ease-spring z-50 flex max-h-(--available-height) w-[260px] max-w-(--available-width) flex-col rounded-[28px] border p-3 shadow-[0_12px_32px_-8px_rgb(0_0_0/0.12)] transition-[opacity,scale,translate] duration-400 [corner-shape:superellipse(1.4)] data-[status=close]:opacity-0 data-[status=close]:duration-150 data-[status=close]:ease-out data-[status=initial]:opacity-0 motion-safe:data-[status=close]:scale-96 motion-safe:data-[status=initial]:scale-96 motion-safe:data-[status=initial]:data-[side=bottom]:-translate-y-1 motion-safe:data-[status=initial]:data-[side=top]:translate-y-1 dark:shadow-[0_12px_32px_-8px_rgb(0_0_0/0.6)]"
              {...getFloatingProps({
                "aria-label": interactive ? label : undefined,
                onPointerDown: handlePointerDown,
                onKeyDown: handleKeyDown,
              })}
            >
              <FloatingArrow
                ref={setArrowElement}
                context={context}
                width={ARROW_WIDTH}
                height={ARROW_HEIGHT}
                d={ARROW_PATH}
                strokeWidth={1}
                className="fill-popover-background stroke-popover-border"
              />
              {content}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
