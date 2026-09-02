import type { RefObject } from "react";
import { Camera, Grid3X3, Image, Menu, MonitorUp, MousePointerClick, Pin, Ruler, X } from "lucide-react";
import { appState, useAppState } from "../../state";
import { setAlwaysOnTop, setClickThrough } from "../../natives/nativeWindow";
import { isTauri } from "../../natives/native";
import type { AppImportImageHandle } from "../app/AppImportImage";

export function AppToolbar(props: { appImportImageRef: RefObject<AppImportImageHandle | null> }) {
  const state = useAppState();
  const tauriMode = isTauri();

  return (
    <div className="absolute left-3 top-3 z-[99999] text-white">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-white/15 bg-black/65 px-3 py-2 text-xs shadow-lg backdrop-blur">
          <Menu size={15} /> Drawing Measure
        </summary>
        <div className="mt-2 max-h-[calc(100vh-5rem)] w-60 overflow-y-auto rounded-xl border border-white/15 bg-slate-950/90 p-3 shadow-2xl backdrop-blur">
          <div className="mb-3 flex gap-1 rounded-lg bg-slate-900 p-1">
            <button className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-2 text-xs ${state.tool === "grid" ? "bg-emerald-700 text-white" : "text-slate-300 hover:bg-slate-800"}`} onClick={() => appState.setTool("grid")}>
              <Grid3X3 size={14} /> Grid
            </button>
            <button className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-2 text-xs ${state.tool === "measure" ? "bg-emerald-700 text-white" : "text-slate-300 hover:bg-slate-800"}`} onClick={() => appState.setTool("measure")}>
              <Ruler size={14} /> Measure
            </button>
          </div>

          <div className="mb-3 border-b border-white/10 pb-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Image</p>
            <button className="mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-slate-800" onClick={() => void props.appImportImageRef.current?.handleImportImage()}><Image size={14} /> Import image</button>
            <button className="mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-slate-800" onClick={() => void props.appImportImageRef.current?.handleImportScreen()}><MonitorUp size={14} /> Capture window</button>
            {tauriMode && <button className="mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-slate-800" onClick={() => void props.appImportImageRef.current?.handleScreenshotImage()}><Camera size={14} /> Screenshot image</button>}
            <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-slate-300 hover:bg-slate-800" onClick={() => void props.appImportImageRef.current?.clearImage()}><X size={14} /> Clear image</button>
          </div>

          <label className="mb-2 flex items-center justify-between text-xs text-slate-200">
            Show grid
            <input type="checkbox" checked={state.gridVisible} onChange={(event) => appState.setGridVisible(event.target.checked)} />
          </label>
          <label className="mb-2 flex items-center gap-2 text-xs text-slate-200">
            Color <input type="color" value={state.color} onChange={(event) => appState.setColor(event.target.value)} />
          </label>
          <label className="mb-2 block text-xs text-slate-200">Spacing: {state.grid}px
            <input className="mt-1 w-full" type="range" min="20" max="300" value={state.grid} onChange={(event) => appState.setGrid(Number(event.target.value))} />
          </label>
          <label className="mb-2 block text-xs text-slate-200">Opacity: {Math.round(state.opacity * 100)}%
            <input className="mt-1 w-full" type="range" min="0.05" max="1" step="0.05" value={state.opacity} onChange={(event) => appState.setOpacity(Number(event.target.value))} />
          </label>
          <label className="mb-4 block text-xs text-slate-200">Rotation: {state.rotation} deg
            <input className="mt-1 w-full" type="range" min="-180" max="180" value={state.rotation} onChange={(event) => appState.setRotation(Number(event.target.value))} />
          </label>

          {tauriMode && <div className="border-t border-white/10 pt-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Overlay</p>
            <label className="mb-2 flex items-center justify-between text-xs text-slate-200"><span className="flex items-center gap-1"><MousePointerClick size={13} /> Click through</span><input type="checkbox" checked={state.clickThrough} onChange={(event) => void setClickThrough(event.target.checked)} /></label>
            <label className="flex items-center justify-between text-xs text-slate-200"><span className="flex items-center gap-1"><Pin size={13} /> Always on top</span><input type="checkbox" checked={state.alwaysOnTop} onChange={(event) => void setAlwaysOnTop(event.target.checked)} /></label>
          </div>}
        </div>
      </details>
    </div>
  );
}
