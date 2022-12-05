import React, { useEffect, useState } from "react";

import CodeEditor from "./CodeEditor";
import Preview from "./Preview";
import bundler from "../blunder";
import Resizable from "./Resizable";
import { searchRepositoriesError } from "../redux/state/reducers/repositories";
import { setServers } from "dns";

const CodeCell: React.FC = () => {
  const [textInput, setCodeInput] = useState<any>("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timerId = setTimeout(async () => {
      const result = await bundler(textInput);
      setCode(result?.code);
      setError(result?.error);
    }, 750);

    return () => {
      clearTimeout(timerId);
    };
  }, [textInput]);

  return (
    <Resizable direction="vertical">
      <div className="cell-wrapper">
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={textInput}
            onChange={(code) => setCodeInput(code)}
          />
        </Resizable>
        <Preview code={code} error={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
