import { ResizableBox, ResizableBoxProps } from "react-resizable";
import React, { useState, useEffect } from "react";
import "./resizable.css";

interface ResizableProp {
  direction: "horizontal" | "vertical";
  children: React.ReactNode;
}

const Resizable: React.FC<ResizableProp> = ({ direction, children }) => {
  let resizableProp: ResizableBoxProps;
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth * 0.75);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: any;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);

        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  if (direction === "horizontal") {
    resizableProp = {
      className: "resize-horizontal",
      height: Infinity,
      width: width,
      resizeHandles: ["e"],
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      onResizeStop: (e, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProp = {
      height: 300,
      width: Infinity,
      resizeHandles: ["s"],
      minConstraints: [Infinity, 24],
      maxConstraints: [Infinity, innerHeight * 0.9],
    };
  }
  return <ResizableBox {...resizableProp}>{children}</ResizableBox>;
};

export default Resizable;
