import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, TextField } from '@material-ui/core';
import { Autocomplete } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

export const Bar = props => {

    const newStyles = makeStyles({
        tool: {
            background: 'red'
        }
    })

    const classes = newStyles();

    const [continentName, setContinentName] = useState('');
    const [region, setRegion] = useState([]);
    const [selectedContinent, setSelectedContinent] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [query, setQuery] = useState('');
    const [countryList, setCountryList] = useState([])
    const [countryName, setCountry] = useState([]);

    const [isContinent, setIsContinent] = useState(false);
    const [isCountry, setIsCountry] = useState(!countryList ? true : false);

    const [cityList, setCityList] = useState([]);
    const [cityName, setCity] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);

    const [data, setData] = useState('');
    const [print, setPrint] = useState(false);

    const [weather, setWeather] = useState('');
    const [logo, setLogo] = useState('');


    useEffect(() => {
        // function getFetchUrl() {
        //     if (query) {
        //         console.log("HAY QUERY");
        //         return 'https://restcountries.com/v3.1/region/' + query;
        //     }
        // }

        async function fetchCountries() {
            let url = 'https://restcountries.com/v3.1/all'
            axios.get(url)
                .then(result => {
                    const data = result.data;
                    callContinent(data);
                })
        }
        // async function fetchData() {
        //     const result = await axios(getFetchUrl());
        //     setQuery(result.data);
        // }
        fetchCountries();
        // fetchData();
    }, [query]);

    const callContinent = (data) => {
        let regionJSON = { name: '', id: '' };
        let regionList = [];
        const allContinents = data.map(conti => conti.region);
        const regionNames = allContinents.filter((value, index, self) => self.indexOf(value) === index)

        for (let i = 0; i < regionNames.length; i++) {
            regionJSON = { "name": regionNames[i], "id": i };
            regionList.push(regionJSON);
        }

        setContinentName(regionNames);
        setRegion(regionList)
    }

    const callContinentFinal = (region) => {
        if (region) {
            setIsContinent(true);
            let url = 'https://restcountries.com/v3.1/region/' + region;
            axios.get(url)
                .then(result => {
                    let countryJSON = { label: '', id: '' };
                    // const countryList = [];
                    // const mapCountriesNames = result.data.map(conti => conti.name.common);
                    // const allCountriesNames = mapCountriesNames.filter((value, index, self) => self.indexOf(value) === index);
                    const allCountries = result.data.map(conti => countryJSON = { "label": conti.name.common, "code": conti.cca2 });

                    for (let i = 0; i < allCountries.length; i++) {
                        countryJSON = { "label": allCountries[i].label, "id": i, "code": allCountries[i].code };
                        countryList.push(countryJSON);
                    }

                    setCountryList(countryList);
                    setCountry(allCountries);

                    inputCountry(countryList);
                })
        } else {
            // isCountry = false;
            setIsContinent(false);
            setIsCountry(false);
            setCountryList([]);
            setCityList([]);
            setSelectedCountry(null);
            setSelectedCity(null);
            setPrint(false);
            setWeather(null);
            setLogo(null);
            let url = 'https://restcountries.com/v3.1/all';
            axios.get(url)
                .then();
        }
    }

    const comboBox = () => {
        if (continentName) {
            return (
                <div>
                    <Autocomplete
                        disablePortal
                        id="continent"
                        options={continentName}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Continent" />}
                        value={selectedContinent}
                        onChange={(e, continentSelected) => {
                            setSelectedContinent(continentSelected);
                            handleContinent(continentSelected);
                        }}
                    />
                </div>
            );
        }
    }

    const handleContinent = (e) => {
        callContinentFinal(e);
    }

    const inputCountry = (params) => {
        if (params.countryName) {
            return (
                <div>
                    {isContinent ?
                        <Autocomplete
                            disablePortal
                            id="countries"
                            sx={{ width: 300 }}
                            options={countryList}
                            renderInput={params => (
                                <TextField {...params} label="Countries" />
                            )}
                            // getOptionLabel={option => option.label}
                            value={selectedCountry}
                            onChange={(e, selCountry) => {
                                setSelectedCountry(selCountry ? selCountry.label : null);
                                handleCountry(selCountry);
                            }}
                        />
                        :
                        <></>
                    }
                </div>
            );
        }
    }

    const handleCountry = (e) => {
        callCountryFinal(e);
    }

    async function callCountryFinal(country) {
        if (country !== null) {
            setIsCountry(true);
            const config = {
                headers: {
                    "X-CSCAPI-KEY": "MDBRNmJOaGRWQ3pJVkRZWThhdWlWYUVkY0FONURzQTBmSG5VRVY1cw=="
                }
            };

            let url = 'https://api.countrystatecity.in/v1/countries/' + country.code + '/states'
            axios.get(url, config)
                .then(result => {

                    let cityJSON = {};
                    const allCities = result.data.map(city => cityJSON = { "label": city.name, "code": city.iso2 });

                    for (let i = 0; i < allCities.length; i++) {
                        cityJSON = { "label": allCities[i].label, "id": i, "code": allCities[i].code };
                        cityList.push(cityJSON);
                    }

                    setCityList(cityList)
                    setCity(allCities)
                    inputCity(cityList)
                })
        } else {
            setIsCountry(false);
            setCityList([]);
            setSelectedCity(null)
            setPrint(false);
            setData('');
            setWeather(null);
            setLogo(null);
        }
    }

    const inputCity = (params) => {
        if (params) {
            if (isCountry) {
                return (
                    <>
                        <div>
                            {/* <Autocomplete
                            id="cities"
                            sx={{ width: 300 }}
                            options={cityList}
                            renderInput={params => (
                                <TextField {...params} label="Cities" />
                            )}
                            // getOptionLabel={option => option.label}
                            value={selectedCity}
                            onChange={(e, selCity) => {
                                setSelectedCity(selCity ? selCity.label : null);
                                handleCity(selCity);
                            }}
                        /> */}

                            <TextField
                                id="cities"
                                label="Search city"
                                type="search"
                                className={classes.textField}
                                value={data}
                                onChange={(e) => setInputCity(e.target.value)}
                            />
                        </div>
                        <button onClick={() => getData()}>CLICK!</button>
                    </>
                );
            }
        }
    }

    const setInputCity = (e) => {
        if (e) {
            setData(e)
        } else {
            setData(e)
            setWeather(null);
            setLogo(null);
        }
    }

    const getData = () => {
        setPrint(true);
        handleCity(data);

    }

    const handleCity = (e) => {
        if (e !== null) {
            callCityFinal(e);
        }
    }


    const callCityFinal = (city) => {
        let cityCountry = city + " " + selectedCountry;
        let params = {
            q: cityCountry,
            aqi: 'no'
        };
        let url = 'http://api.weatherapi.com/v1/forecast.json?key=331a7c07ae6e48b0b1c182302220602'
        axios.get(url, { params })
            .then(result => {
                const data = result.data.forecast.forecastday[0];
                const todayWeather = data.day.condition.text;
                const logoWeather = data.day.condition.icon;

                console.log(data);
                setWeather(todayWeather)
                setLogo(logoWeather);
            })
    }



    return (
        <>
            <AppBar position='static' className={classes.tool} >
            </AppBar>
            {comboBox()}
            {{ isContinent } ? inputCountry({ countryName }) : <></>}
            {{ isCountry } ? inputCity({ cityName }) : <></>}
            {{ print } ? <div>{weather} <img alt="" src={logo} /></div> : <></>}
        </>
    )
}

export default Bar;