import React from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import prettier from "prettier";
import parser from "prettier/parser-babel";

interface ICodeEditorProp {
  initialValue: string;
  onChange(value: string | undefined): void;
}

const CodeEditor: React.FC<ICodeEditorProp> = ({ initialValue, onChange }) => {
  function handleEditorChange(
    value: string | undefined,
    event: monaco.editor.IModelContentChangedEvent
  ) {
    console.log("value", value);
    onChange(value);
  }

  const formatCode = () => {
    console.log("initialValue", initialValue);
    const formatted = prettier
      .format(initialValue, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, "");
    onChange(formatted);
    console.log("formatted", formatted);
  };

  return (
    <div>
      <button onClick={formatCode}>Format</button>
      <Editor
        // onChange={handleEditorChange}
        value={initialValue}
        onChange={handleEditorChange}
        height="500px"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        theme="vs-dark"
        options={{
          wordWrap: "on",
          minimap: {
            enabled: false,
          },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          fontSize: 16,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
