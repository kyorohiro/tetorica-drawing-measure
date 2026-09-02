import { useCallback, useEffect, useRef, useState } from "react";
import { draw, resizeCanvas } from "../../algos/deskel";
import { appState, useAppState } from "../../state";
import { showToast } from "../utils/toast";
import { AppDeskelMeasureToolbar } from "../toolbar/AppDeskelMeasureToolbar";
import { MeasureHandler } from "./appDeskelImpl/MeasureHandler";
import type { AppDeskelPoint, DeskelToolContext, MeasureMode, QuadMode } from "./appDeskelImpl/DeskelToolHandler";

export function AppOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const measureHandlerRef = useRef(new MeasureHandler());
  const startRef = useRef<AppDeskelPoint | null>(null);
  const currentRef = useRef<AppDeskelPoint | null>(null);
  const draggingRef = useRef(false);
  const [, setDragging] = useState(false);
  const [measureMode, setMeasureMode] = useState<MeasureMode>("line");
  const [quadMode, setQuadMode] = useState<QuadMode>("off");
  const [toolbarOpen, setToolbarOpen] = useState(true);
  const state = useAppState();

  const getPoint = useCallback((event: PointerEvent): AppDeskelPoint => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }, []);

  const redraw = useCallback((resize = false) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (resize) resizeCanvas({ canvas, ctx });
    draw({ canvas, ctx });
    if (state.tool !== "measure") return;

    const context: DeskelToolContext = {
      canvas,
      ctx,
      state: {
        tool: state.tool,
        target: "screen",
        color: state.color,
        measureUnit: state.measureUnit,
        measureMode,
        quadMode,
      },
      startRef,
      currentRef,
      draggingRef,
      setDragging: (value) => {
        draggingRef.current = value;
        setDragging(value);
      },
      getPoint,
      getSelectionRect: () => null,
      requestRedraw: () => redraw(),
      setMeasureUnit: (value) => appState.setMeasureUnit(value),
      captureFromImage: async () => {},
      captureFromScreen: async () => {},
      analyzeFromImage: async () => {},
      analyzeFromScreen: async () => {},
      showToast,
    };
    measureHandlerRef.current.redraw(context);
  }, [getPoint, measureMode, quadMode, state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = () => {
      const ctx = canvas.getContext("2d")!;
      return {
        canvas,
        ctx,
        state: { tool: state.tool, target: "screen" as const, color: state.color, measureUnit: state.measureUnit, measureMode, quadMode },
        startRef,
        currentRef,
        draggingRef,
        setDragging: (value: boolean) => { draggingRef.current = value; setDragging(value); },
        getPoint,
        getSelectionRect: () => null,
        requestRedraw: () => redraw(),
        setMeasureUnit: (value: number) => appState.setMeasureUnit(value),
        captureFromImage: async () => {}, captureFromScreen: async () => {},
        analyzeFromImage: async () => {}, analyzeFromScreen: async () => {}, showToast,
      } satisfies DeskelToolContext;
    };
    const handler = measureHandlerRef.current;
    canvas.style.touchAction = "none";
    const onDown = (event: PointerEvent) => {
      if (state.tool === "measure") {
        handler.onPointerDown(context(), event);
        canvas.setPointerCapture?.(event.pointerId);
      }
      redraw();
    };
    const onMove = (event: PointerEvent) => { if (state.tool === "measure") handler.onPointerMove(context(), event); redraw(); };
    const onUp = (event: PointerEvent) => {
      if (state.tool === "measure") handler.onPointerUp(context());
      if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      redraw();
    };
    const onCancel = (event: PointerEvent) => {
      handler.onPointerCancel(context());
      if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      redraw();
    };
    const onResize = () => redraw(true);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onCancel);
    window.addEventListener("resize", onResize);
    redraw(true);
    return () => {
      canvas.removeEventListener("pointerdown", onDown); canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp); canvas.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("resize", onResize);
    };
  }, [getPoint, measureMode, quadMode, redraw, state]);

  return <>
    <canvas ref={canvasRef} className={`absolute inset-0 ${state.tool === "measure" ? "pointer-events-auto" : "pointer-events-none"}`} />
    <AppDeskelMeasureToolbar visible={state.tool === "measure"} open={toolbarOpen} onToggle={() => setToolbarOpen((value) => !value)} measureMode={measureMode} setMeasureMode={setMeasureMode} quadMode={quadMode} setQuadMode={setQuadMode} onApplyQuad={() => {}} />
  </>;
}
