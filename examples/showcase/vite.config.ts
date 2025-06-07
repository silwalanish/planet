import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

/** @type {import('vite').UserConfig} */
export default {
  base: "./",
  plugins: [wasm(), topLevelAwait()],
};
