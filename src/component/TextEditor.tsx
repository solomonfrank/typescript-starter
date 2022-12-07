import React, { useState, useEffect, useRef } from "react";
import MDEditor, { ContextStore } from "@uiw/react-md-editor";
import "./text-editor.css";

export default function MarkDownEditor() {
  const [value, setValue] = React.useState<any>("**Hello world!!!**");
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleChange = (value: string | undefined) => {
    console.log("value", value);
    setValue(value);
  };

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref &&
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setIsEditing(false);
    };
    window.addEventListener("click", listener, { capture: true });

    return () => {
      window.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (isEditing) {
    return (
      <div ref={ref} className="text-editor">
        <MDEditor onChange={handleChange} value={value} />
      </div>
    );
  }
  return (
    <div className="text-editor" onClick={() => setIsEditing(true)}>
      {/* <MDEditor value={value} onChange={handleChange} /> */}
      <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
}
