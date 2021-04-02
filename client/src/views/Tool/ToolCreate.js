import React, { useState } from 'react';
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

const ToolCreate = (props) => {
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState({});
    const { id }=props;

    const onSubmitHandler = (e) => {
        e.preventDefault();
        //make a post request to create a new tool`
        axios.post(`http://localhost:8000/api/user/${id}/tool`, {
            type,
            description,
            price,
            startDate,
            endDate
        })
            .then(res => {
                console.log(res);
                if (res.data.message == "error") {
                    setErrors(res.data.errors.errors.tools.errors)
                } else { navigate(`/user/${id}`) }
            })
            .catch(err => console.log(err))
    }

    console.log(errors);
    return (
        <div>
            <Button color="primary" variant="outlined" onClick={e => navigate(`/homepage`)}>Home</Button>
            <h3> Create a tool for rental! </h3>
            <div elevation={1} style={styles.paper}>
            <form onSubmit={onSubmitHandler} >
                <FormControl variant="outlined" style={styles.input}>
                    <InputLabel>Type</InputLabel>
                    <OutlinedInput type="text" name="type" onChange={(e) => setType(e.target.value)} value={type}/>
                <span> {errors.type ? errors.type.message : ''} </span>
                </FormControl>
                <FormControl variant="outlined" style={styles.input}>
                    <InputLabel>Description</InputLabel>
                    <OutlinedInput type="text" name="description" onChange={(e) => setDescription(e.target.value)} value={description}/>
                    <span> {errors.description ? errors.description.message : ''} </span>
                </FormControl>
                <FormControl variant="outlined" style={styles.input}>
                    <InputLabel>Daily Price (in $)</InputLabel>
                    <OutlinedInput type="number" name="price" onChange={(e) => setPrice(e.target.value)} value={price}/>
                    <span> {errors.price ? errors.price.message : ''} </span>
                </FormControl>
                <FormControl variant="outlined" style={styles.input}>
                    <span>When will the tool be available:</span>
                    <OutlinedInput type="date" name="startDate" onChange={(e) => setStartDate(e.target.value)} value={startDate}/>
                    <span> {errors.startDate ? errors.startDate.message : ''} </span>
                </FormControl>
                <FormControl variant="outlined" style={styles.input}>
                    <span>When will you need the tool back by:</span>
                    <OutlinedInput type="date" name="endDate" onChange={(e) => setEndDate(e.target.value)} value={endDate}/>
                    <span> {errors.endDate ? errors.endDate.message : ''} </span>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    Add New Tool
                </Button>
            </form>
            </div>
        </div>
    )
}

export default ToolCreate;