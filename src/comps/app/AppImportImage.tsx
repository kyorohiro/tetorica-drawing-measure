import { forwardRef, RefObject, useImperativeHandle } from "react"
import { getTaurPlatformInfo, isTauri } from "../../natives/native";
import { useDialog } from "../utils/useDialog";
import { AppBackgroundImageCanvasHandle, useBackgroundImageState } from "./AppBackgroundImageCanvas";
import { getVideo } from "../../natives/nativeWebScreenshot";
import { captureAndCrop } from "../../natives/nativeScreenshot";
import { hasPermission, openPrivacySettings, requestScreenCapturePermission } from "../../natives/nativePermissionCheck";

export type AppImportImageHandle = {
    handleImportImage: () => Promise<void>;
    handleImportScreen: () => Promise<void>;
    handleScreenshotImage: () => Promise<void>;
    clearImage: () => Promise<void>;
};

type AppImportImageProps = {
    onChangeState?: () => void
    appBackgroundImageCanvasRef?: RefObject<AppBackgroundImageCanvasHandle | null>;
}

export const AppImportImage = forwardRef<AppImportImageHandle,  AppImportImageProps>(function (props, ref) {
    const _backgroundImageState = useBackgroundImageState();
    const dialog = useDialog();


    const syncBackgroundImageState = () => {
        props.onChangeState?.();
    };

    const handleImportImage = async () => {
        const ret = await dialog.showFileDialog({});
        if (props.appBackgroundImageCanvasRef?.current) {
            if (ret?.files && ret.files.length > 0) {
                await props.appBackgroundImageCanvasRef.current.addImage(ret.files[0]);
                syncBackgroundImageState()
            }
        }
    };

    const openPwa = () => {
        const pwaUrl = "https://kyorohiro.github.io/tetorica-drawing-measure/";
        const pwaWindow = window.open(pwaUrl, "_blank", "noopener");
        if (!pwaWindow) window.location.assign(pwaUrl);
    };

    const handleImportScreen = async () => {
          if (window.self !== window.top) {
            const moveToPwa = await dialog.showConfirmDialog({
              title: "Screen Sharing Unavailable",
              body: "Screen sharing is not supported inside the itch.io preview. Please open the PWA version instead.",
              cancelText: "Cancel",
              okText: "Move",
            });
            if (moveToPwa) openPwa();
            return;
          }
          const data = await getVideo();
          await props.appBackgroundImageCanvasRef?.current?.addVideo(data);
    };

    const handleScreenshotImage = async () => {
        if (!isTauri()) return;
        if (await getTaurPlatformInfo() === "macos" && !(await hasPermission())) {
            const allowCapture = await dialog.showConfirmDialog({
                title: "Allow Screen Recording",
                body:
                    "To capture a screenshot from other apps, Tetorica Drawing Measure needs macOS Screen Recording permission.\n\n" +
                    "It captures only the area behind this window and never uploads your screen.",
                cancelText: "Not now",
                okText: "Allow Screen Recording",
            });
            if (!allowCapture) return;

            await requestScreenCapturePermission();
            if (!(await hasPermission())) {
                await openPrivacySettings();
                return;
            }
        }
        const capture = await captureAndCrop({ hideWindow: true });
        const image = new Blob([capture.pngBuffer], { type: "image/png" });
        await props.appBackgroundImageCanvasRef?.current?.addImage(image);
    };

    const clearImage = async () => {
        await props.appBackgroundImageCanvasRef?.current?.clear();
    };

    useImperativeHandle(
        ref,
        () => ({
            handleImportImage,
            handleImportScreen,
            handleScreenshotImage,
            clearImage,
        }),
        []
    );
    return (
        <>
            {!_backgroundImageState.hasImage && !isTauri() && (
                <div className="fixed inset-0 z-[99998] flex items-center justify-center pointer-events-none">
                    <div className="pointer-events-auto flex flex-col items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/85 px-6 py-5 text-white shadow-2xl backdrop-blur">
                        <div className="text-center">
                            <div className="text-base font-semibold">Import Image</div>
                            <div className="mt-1 text-sm text-slate-300">
                                Please import an image to start in browser mode
                            </div>
                        </div>

                        <button
                            onClick={handleImportImage}
                            className="rounded-xl border border-sky-400 bg-sky-700 px-5 py-2 text-sm font-medium text-white shadow transition hover:bg-sky-600"
                        >
                            Import Image
                        </button>
                        <button
                            onClick={handleImportScreen}
                            className="rounded-xl border border-sky-400 bg-sky-700 px-5 py-2 text-sm font-medium text-white shadow transition hover:bg-sky-600"
                        >
                            Import Screen
                        </button>
                    </div>
                </div>
            )}

        </>
    );
});
