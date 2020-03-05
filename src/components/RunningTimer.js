import React from 'react'

export function RunningTimer(props) {
    return (
        <h4>
            {`Running Timer ${props.timer[1].project}/${props.timer[0]}/ Count: ${props.count}`}
        </h4>
    )
}
