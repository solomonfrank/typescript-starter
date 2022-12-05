import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "../utils/intercept";

let service: esbuild.Service;
const bundler = async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  }

  try {
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(rawCode)],
      define: {
        //  global: window,
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });
    console.log("Ebtererererer");
    return {
      code: result.outputFiles[0].text,
      error: "",
    };
  } catch (ex) {
    console.log("exeception", ex);
    if (ex instanceof Error) {
      return {
        code: "",
        error: ex.message,
      };
    }

    return {
      code: "",
      error: "Something went wrong",
    };
  }
};

export default bundler;
