import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

export const City = (props) => {
    const test = props;
    const [filter, setFilter] = useState('');
    const apiKey = '331a7c07ae6e48b0b1c182302220602';

    useEffect(() => {
        axios.get(' http://api.weatherapi.com/v1/search.json?key=331a7c07ae6e48b0b1c182302220602&q=Elche')
            .then(result => {
                const data = result.data;
                // console.log(data);
                setFilter(data);
            })
    }, [])

    const weather = () => {
        return (
            Object.values(filter).map(city => {
                // if (filter[0] === city) {
                return (
                    <div className={city.name}
                        key={city.id}
                        onClick="">
                        {city.name}
                    </div>
                )
                // } else {
                // return (
                //     <div key={city.id}>
                //         {city.name}
                //     </div>
                // )
                // }
            })
        )
    }

    return (
        <>
            {weather()}
        </>
    )
}

export default City;