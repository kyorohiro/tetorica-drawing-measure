import { useRef } from "react";
import "../../style.css";
import { AppOverlay } from "./AppOverlay";
import { AppToolbar } from "../toolbar/AppToolbar";
import { AppBackgroundImageCanvas, AppBackgroundImageCanvasHandle } from "./AppBackgroundImageCanvas";
import { AppImportImage } from "./AppImportImage";
import type { AppImportImageHandle } from "./AppImportImage";

export default function App() {
  const backgroundImageRef = useRef<AppBackgroundImageCanvasHandle | null>(null);
  const importImageRef = useRef<AppImportImageHandle | null>(null);

  return (
    <main id="app" className="relative h-screen w-screen">
      <AppBackgroundImageCanvas ref={backgroundImageRef} />
      <AppOverlay />
      <AppImportImage ref={importImageRef} appBackgroundImageCanvasRef={backgroundImageRef} />
      <AppToolbar appImportImageRef={importImageRef} />
    </main>
  );
}
