import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    Checkbox,
    Select,
    Button
} from '@material-ui/core';

const styles = {
    paper: {
        width: "12rem", padding: "1rem", display: "inline-block", verticalAlign: 'text-top'
    },
    input: {
        marginBottom: "1rem"
    },
    button: {
        width: "50%"
    }
}


export default props => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState({});


    useEffect(() => {
        axios.get(`http://localhost:8000/api/user/` + props.id)
            .then(res => {
                setFirstName(res.data.user.firstName);
                setLastName(res.data.user.lastName);
                setAddress(res.data.user.address);
                setType(res.data.user.type);
                setDescription(res.data.user.description);
                setPrice(res.data.user.price)
                setLoaded(true);
            })
    }, []);

    const updateUser = e => {
        e.preventDefault();
        axios.put(`http://localhost:8000/api/user/` + props.id, {
            firstName,
            lastName,
            address,
            type,
            description,
            price
        })
            .then(res => {
                console.log(res);
                if (res.data.errors) {
                    setErrors(res.data.errors.errors)
                } else { navigate("/homepage") }

            })
            .catch(err => console.log(err))
    }
    return (
        <div>
            <Button color="primary" variant="outlined" onClick={e => navigate(`/homepage`)}>Home</Button>
            <h3> Edit {firstName} {lastName} </h3>

            <div elevation={1} style={styles.paper}>
                <form onSubmit={updateUser} >
                    <FormControl variant="outlined" style={styles.input}>
                        <InputLabel>First Name</InputLabel>
                        <OutlinedInput type="text" name="firstName" onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}/>
                    <span>{errors.firstName ? errors.firstName.message : ''}</span>
                    </FormControl>
                    <FormControl variant="outlined" style={styles.input}>
                        <InputLabel>Last Name</InputLabel>
                        <OutlinedInput type="text" name="lastName" onChange={(e) => setLastName(e.target.value)}
                                value={lastName}/>
                    <span>{errors.lastName ? errors.lastName.message : ''}</span>
                    </FormControl>
                    <FormControl variant="outlined" style={styles.input}>
                        <InputLabel>Address</InputLabel>
                        <OutlinedInput type="text" name="address" onChange={(e) => setAddress(e.target.value)}
                                value={address}/>
                    </FormControl>
                    {/* <label htmlFor="Type">  Type: </label>
                    <input type="text" name="type" onChange={(e) => setType(e.target.value)} value={type}/>
                    <span > {errors.type ? errors.type.message : ''} </span> 
                    <br/>
                    
                    <label htmlFor="Description" >  Description: </label><br/>
                    <input type="text" name="description" onChange={(e) => setDescription(e.target.value)} value={description}/><br/>
                    <span > {errors.description ? errors.description.message : ''} </span>
                    <br/>

                    <label htmlFor="price"> Price: </label><br/>
                    <input type="number" name="price" onChange={(e) => setPrice(e.target.value)} value={price}/>
                    <span > {errors.price ? errors.price.message : ''} </span>
                    <br/> */}
                <Button type="submit" variant="contained" color="primary">
                    Edit User
                </Button>
                </form>
            </div>
        </div>
    )


}