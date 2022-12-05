import React, { useEffect, useRef } from "react";

interface IPreviewProp {
  code: string;
  error: string;
}

const html = `
<html>
<head>
<style> html {
  background-color: white
}</style>
</head>
<body>
      <div id="root"></div>
      <script>

      const handleError = (ex) => {
        const root = document.querySelector("#root");
        root.innerHTML = '<div style="color: red;"> Runtime error' + ex + '</div>'
        console.error(ex)
      }
      window.addEventListener('error', (e) => {
        e.preventDefault()
        handleError(e.error)
      })
 
     window.addEventListener("message", (message) => {
   
      try{
          console.log("message", message);
          eval(message.data)
      }catch(ex) {
        handleError(ex)
        console.log(ex)
      }
    });

   
      </script>
</body>
</html>
`;

const Preview: React.FC<IPreviewProp> = ({ code, error }) => {
  const iframeRef = useRef<any>();

  console.log("errorrrr", error);

  useEffect(() => {
    // Reset everytime code changes
    iframeRef.current.srcDoc = html;

    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);
  return (
    <div className="preview-wrapper">
      <iframe ref={iframeRef} srcDoc={html} id="iframe" title="test" />
      {error && <span className="iframe-error">{error}</span>}
    </div>
  );
};

export default Preview;
