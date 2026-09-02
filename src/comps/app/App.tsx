import "../../style.css";
import { AppOverlay } from "./AppOverlay";
import { AppToolbar } from "../toolbar/AppToolbar";

export default function App() {
  return (
    <main id="app" className="relative h-screen w-screen">
      <AppOverlay />
      <AppToolbar />
    </main>
  );
}
