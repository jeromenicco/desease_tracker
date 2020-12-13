import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'// for chart-js config (graph) format data 


const options = { // set config for <Line> from chart-js check doc
    legend: {
        display: false,
    },
    elements: {
        points: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callback: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0")
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    //Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a")
                    },
                },
            },
        ],
    },
}

const buildChartData = (data, casesType) => { // sets x axe to date and y axes to cases, check video at 2h50
    let chartData = []
    let lastDataPoint 

    for (let date in data.cases)  {
        if (lastDataPoint) {
            const newDataPoint = { //modify the incoming data
                x: date,
                y: data[casesType][date] - lastDataPoint //difference between last date and current date
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[casesType][date]
    }
    return chartData
}

const LineGraph = ({ casesType = 'cases' }) => {
    const [data, setData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120') //endpoint for all ww history of the last 120 days data
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                const chartData = buildChartData(data, casesType)
                setData(chartData) // translates to the chart.js format
            })
        }
        fetchData()
    }, [casesType])

    return (
        <div>
            {data?.length > 0 && ( // at the start data is 0
                 <Line
                 data={{
                     datasets: [
                         {
                             backgroundColor: 'rgba(204, 16, 52, 0.5)',
                             borderColor: '#CC1034',
                             data: data
                      }
                     ]
                 }}
                 options={options} // config numeral 
             />
            )}
           
        </div>
    )
}

export default LineGraph

