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
    const [selectedRegion, setSelectedRegion] = useState(null);


    useEffect(() => {
        let url = 'https://restcountries.com/v3.1/all'
        axios.get(url)
            .then(result => {
                const data = result.data;
                console.log("PAISES");
                console.log(data);
                callContinent(data);
            })
    }, [])

    const callContinent = (data) => {
        //DUDA - CREAR ASI UN ARRAY DE OBJETOS ?? 
        //COMO SACAR DE data TODOS LOS CONTINENTES EN UN OBJETO QUE INCLUYA SUS IDs
        let regionJSON = { name: '', id: '' };
        let regionList = [];
        const allContinents = data.map(conti => conti.region);
        const regionNames = allContinents.filter((value, index, self) => self.indexOf(value) === index)

        for (let i = 0; i < regionNames.length; i++) {
            regionJSON = { "name": regionNames[i], "id": i };
            regionList.push(regionJSON);
        }
        console.log(regionList)

        setContinentName(regionNames);
        setRegion(regionList)

        //TEST CON EUROPA PARA VER DATOS
        let url = 'https://restcountries.com/v3.1/region/europe';
        axios.get(url)
            .then(result => {
                const data = result.data;
                console.log("CONTINENTE")
                console.log(result);
            })
    }

    const comboBox = () => {
        //DUDA - LO QUE TE PASÉ POR WHATSAPP SOBRE PASARLE PROPIEDADES A TextField Y PODER SABER
        //A QUE CONTINENTE LE HE HECHO CLICK
        return (
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={continentName}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Region" />}
                value={selectedRegion}
                onChange={(e, selectedRegion) => {
                    setSelectedRegion(selectedRegion);
                    handleRegion(selectedRegion);
                }}
            />
        );
    }

    const handleRegion = (e) => {
        callContinentFinal(e.target.value);
    }

    const callContinentFinal = (region) => {
        //DUDA - LA IDEA ES PASAR POR AQUI LA REGION-CONTINENTE Y SACAR LOS PAISES QUE TIENE
        let url = 'https://restcountries.com/v3.1/region/' + region;
        axios.get(url)
            .then(result => {
                const data = result.data;
                console.log("EL CONTINENTE ES " + region)
                console.log(result);
            })
    }

    //PRUEBAS PARA VER EL TIEMPO DE ALGUN SITIO
    // const callCity = (city) => {
    //     let params = {
    //         q: city,
    //         aqi: 'no'
    //     };
    //     let url = 'http://api.weatherapi.com/v1/forecast.json?key=331a7c07ae6e48b0b1c182302220602&q=Elche'
    //     axios.get(url, { params })
    //         .then(result => {
    //             const data = result.data;
    //             // Setear Datos
    //             console.log(result);
    //         })
    // }



    return (
        <>
            <AppBar position='static' className={classes.tool} >
            </AppBar>
            {comboBox()}
        </>
    )
}

export default Bar;