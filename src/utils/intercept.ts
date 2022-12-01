import * as esbuild from "esbuild-wasm";
import localForage from "localforage";
import axios from "axios";

var store = localForage.createInstance({
  name: "fetchAsset",
});

export const unpkgPathPlugin = (textInput: string) => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResole", args, "stepOne");
        if (args.path === "index.js") {
          return { path: args.path, namespace: "a" };
        }

        if (args.path.includes("./") || args.path.includes("../")) {
          return {
            namespace: "a",
            path: new URL(
              args.path,
              "https://unpkg.com" + args.resolveDir + "/"
            ).href,
          };
        }

        console.log("Last condition");

        return { namespace: "a", path: "https://unpkg.com/" + args.path };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args, "step two");

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: textInput,
          };
        }

        const cacheResult = await store.getItem<esbuild.OnLoadResult>(
          args.path
        );

        console.log("cacherResult", cacheResult);

        if (cacheResult) {
          return cacheResult;
        }
        console.log("API", args.path);
        const fileType = args.path.match(/.css$/) ? "css" : "jsx";

        const { data, request } = await axios.get(args.path);

        const escapedData = data
          .replace(/\n/g, "")
          .replace(/"/g, '//"')
          .replace(/'/g, "//'");

        const contents =
          fileType === "css"
            ? `
          const style = document.createElement("style");
          style.innerText = '${escapedData}';
          document.head.appendChild(style);
          `
            : data;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await store.setItem(args.path, result);
        return result;
      });
    },
  };
};
