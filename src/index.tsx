import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { Provider } from "react-redux";
import { useAppDispatch, useAppSelector } from "./hooks";
import { store } from "./redux/state/store";
import {
  searchRepositoriesError,
  searchRepositoriesSuccess,
  searchRepository,
} from "./redux/state/reducers/repositories";
import { unpkgPathPlugin } from "./utils/intercept";
import CodeEditor from "./component/CodeEditor";

import * as esbuild from "esbuild-wasm";
// import { program } from "commander";
//import { serveCommand } from "./command/serve";

// program.addCommand(serveCommand);

// serveCommand.parse();

const App = () => {
  const [phrase, setPhrase] = useState("");
  const [textInput, setCodeInput] = useState<any>("");
  const iframeRef = useRef<any>();
  const repos = useAppSelector((state) => state.repositories);

  const dispatch = useAppDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhrase(e.target.value);
  };
  const serviceRef = useRef<any>();

  const startService = async () => {
    serviceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };
  useEffect(() => {
    startService();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchRepos(phrase);
  };
  const fetchRepos = async (phrase: string) => {
    try {
      dispatch(searchRepository());
      const { data } = await axios.get(
        "https://registry.npmjs.org/-/v1/search",
        {
          params: {
            text: phrase,
          },
        }
      );

      const names = data.objects.map((item: any) => {
        return item.package.name;
      });

      dispatch(searchRepositoriesSuccess(names));
    } catch (ex) {
      if (ex instanceof Error) {
        dispatch(searchRepositoriesError(ex.message));
      }
    }
  };

  const compileHandle = async () => {
    if (!serviceRef.current) {
      return;
    }

    iframeRef.current.srcdoc = html;
    const result = await serviceRef.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(textInput)],
      define: {
        //  global: window,
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    iframeRef.current.contentWindow.postMessage(
      result.outputFiles[0].text,
      "*"
    );

    // console.log("resulttt", result);
  };

  const html = `
  <html>
  <head></head>
  <body>
        <div id="root"></div>
        <script>
       console.log("From frame")
       window.addEventListener("message", (message) => {
     

        try{
            console.log("message", message);
            eval(message.data)
        }catch(ex) {
            const root = document.querySelector("#root");
            root.innerHTML = '<div style="color: red;"> Runtime error' + ex + '</div>'
            console.error(ex)
        }
      });

     
        </script>
  </body>
  </html>
`;
  return (
    <div className="input-wrapper">
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={onChange} value={phrase} />
        <button type="submit">Submit</button>
      </form>
      {repos.loading && <div>Loading...</div>}
      {!repos.loading && repos.error && <div>{repos.error}</div>}
      {!repos.loading && repos.data.length ? <div>{repos.data}</div> : null}

      <CodeEditor
        initialValue={textInput}
        onChange={(code) => setCodeInput(code)}
      />
      <div style={{ marginTop: "3rem" }}>
        <textarea onChange={(e) => setCodeInput(e.target.value)} />
        <button onClick={compileHandle}> Click</button>
      </div>

      <div style={{ marginTop: "3rem" }}></div>
      <iframe ref={iframeRef} srcDoc={html} id="iframe" title="test"></iframe>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.querySelector("#root") as HTMLElement
);

// const root = ReactDOM.createRoot
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
