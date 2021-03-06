import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

import './InfoBox.css'



const InfoBox = ({ title, cases, total, active, ...props}) => {
    return (
        <div>
            <Card className='infoBox' onClick={props.onClick}>
                <CardContent>

                    <Typography className='infoBox__title' color='textSecondary'>{title}</Typography>

                    <h2 className='infoBox__cases'>{cases}</h2>

                    <Typography className='infoBox__total'>{total} Total</Typography>

                </CardContent>
            </Card>
        </div>
    )
}

export default InfoBox
