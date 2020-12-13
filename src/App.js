
import React, { useState, useEffect } from 'react'
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'
import { sortData, prettyPrintStat } from './util'

import './App.css'
import 'leaflet/dist/leaflet.css'


 

const App = () => {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat:54.525961, lng:28.3484})
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCoutries] = useState([])
  const [casesType, setCasesType] = useState('cases')
  

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all') //sets worldwide to upload when app renders
    .then(res => res.json())
    .then(data => {
      setCountryInfo(data)
    })
  }, [countryInfo])

  useEffect(() => {
    const getCoutriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then(res => res.json())
      .then(data => {
        const countries = data.map(country => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }))

          const sortedData = sortData(data) // func from util.js
          setTableData(sortedData) // set to sortedData
          setCountries(countries)
          setMapCoutries(data)
            // console.log(data)
      })
    }
    getCoutriesData()
  }, [])

  const onCountryChange = async (e) => {
    const countryCode  = e.target.value
    
    const url = 
      countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(res => res.json())
    .then(data => {
      setCountry(countryCode)
      setCountryInfo(data) //All data from country response
        console.log('COUTRY INFO', countryInfo)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      console.log('MAP CENTER', mapCenter)
      setMapZoom(4)
    })
  }
  console.log(countryInfo)
   //select country !

  return (
    <div className="app">

      <div className='app__left'>
        <div className='app__header'>
          <h1>ww.disease.TRACKER</h1>
            <FormControl className='app__dropdown'>
              <Select
                variant='outlined'
                value={country}
                onChange={onCountryChange}>

                <MenuItem value='worldwide'>Worldwide</MenuItem>

                {
                  countries.map((country, i) => (
                    <MenuItem key={i}
                    value={country.value}>{country.name}
                    </MenuItem>
                  ))
                }

              </Select>
            </FormControl> 
        </div>

        <div className='app__stats'>
          <InfoBox 
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title='CoronaVirus cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox 
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox 
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title='Deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />  
    </div>

    <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
    </Card>

    

  </div> 
  );
}
 
export default App
