import React from 'react'
import Typography  from '../atoms/Typography'
import { isValid, format } from 'date-fns'

/**
 * @param {*} props
 *  
 */

export function TimePeriod(props) {
    return (
        <Typography>
            {isValid(props.end) && isValid(props.start) ? 
            format(props.start, 'hh:mm aaa') + ' - ' + format(props.end, 'hh:mm aaa') :
            isValid(props.start) ? 
            format(props.start, 'hh:mm aaa') + ' -  ... ' :
            ''}
        </Typography>
    )
}
