import React, { FC, useState, useRef, useEffect } from 'react'


interface ChildProps {
    color: string;
    handleClick: () => void,
    children?: React.ReactNode
}

const users  = [
    { name: "Solomon Rock", age: 10},
    { name: "Solomon Frank", age: 15},
    { name: "John Doe", age: 18}
]


export const Child = (props: ChildProps) => {    // Generic prop definition( not specific to react)

    return <h1>I'm Child with color { props.color}</h1>
}


export const ChildFC: FC<ChildProps> = ({ handleClick}) => {

    const [candidates, setCandidates] = useState<{name: string, age: number}[]>(users)

    const inputRef = useRef<HTMLInputElement | null>(null)



    useEffect(() => {
        if(!inputRef.current) { // type guide
            return;
        }

        inputRef.current.focus()

    }, [])


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("eeeee", e.target.value)
  }

  const onDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    console.log("drag start", e)
  }


  const onDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
    console.log("onDragEnd", e)
  }
   return (
    <div><button onClick={handleClick}>Click</button>
{ candidates.map((item, idx) => <h3 key={idx}> { item.name}</h3>)}
<input type="text" onChange={onChange}  />
<input type="text" ref={inputRef}  />
<button draggable onDragStart={onDragStart} onDragEnd={onDragEnd}>Drag  me</button>
    </div>
   )
}