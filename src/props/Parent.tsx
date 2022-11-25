import React from 'react'
import { ChildFC } from './Child'


const Parent = () => {
    return <ChildFC color='ref'   handleClick={() => console.log("Click")} >Hehrllo </ChildFC>
}

export default Parent;