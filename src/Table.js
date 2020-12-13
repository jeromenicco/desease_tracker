import React from 'react'
import numeral from 'numeral'
import './Table.css'

const Table = ({ countries }) => {
    return (
        <div className='table'>
            {
                countries.map(({country, cases}, i) => ( // {destructuration} in .map !!!!
                    <tr key={i}>
                        <td>{country}</td>
                        <td>
                            <strong>{numeral(cases).format('0,0.0000')}</strong>
                        </td>
                    </tr>
                ))
            }
        </div>
    )
}

export default Table
