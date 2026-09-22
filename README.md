# TETORICA DRAWING MEASURE

画面に重ねて使う、描画のための Grid と Measure ツールです。

`tetorica-drawing-measure` は、他のアプリの上に透明なオーバーレイを置き、グリッド表示と測り棒で描画を補助します。画像の読み込みや色分析は持たず、画面上での比率確認に集中します。

## Features

- 回転・間隔・色・透明度を調整できるグリッド
- 直線、連続測定、基準単位の設定
- 常に前面表示
- クリック透過

## Usage

`Grid` ではグリッドの表示と見た目を調整します。

`Measure` では画面をドラッグして距離を測定します。右下の測定ツールバーから、直線・連続測定・基準単位の設定を切り替えられます。

デスクトップ版の `Click through` を有効にした後は、`Ctrl+Shift+J` でマウス透過を解除できます。Mac では `Command+Shift+J` でも解除できます。他のアプリを操作中でも有効です。

測定中に `Shift` を押している間は、一時的に `Set Unit` が有効になります。ドラッグ前・途中のどちらからでも使えます。Shift を押したままマウスを離すと基準の長さが更新され、Shift を離すと元の測定モードに戻ります。

## Development

Requirements: Node.js and Rust (Tauri v2 development environment)

```bash
npm install
npm run tauri:dev
```

Production build:

```bash
npm run build
npm run tauri build
```

## License

MIT
