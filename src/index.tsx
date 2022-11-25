import React from 'react'
import ReactDOM from 'react-dom/client'
import Parent from "./props/Parent";


const App = () => {

    return <Parent />
}
const root = ReactDOM.createRoot(document.querySelector("#root") as HTMLElement)
// const root = ReactDOM.createRoot
 root.render( <React.StrictMode><App /></React.StrictMode>)