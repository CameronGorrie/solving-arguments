import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/app.ts",
  output: {
    file: "./dist/app.js",
    format: "cjs"
  },
  plugins: [
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs()
  ],
  watch: {
    include: "src/**"
  }
};
