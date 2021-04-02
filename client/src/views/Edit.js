import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, navigate } from '@reach/router';


export default props => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    // const [skills, setSkills] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [errors, setErrors] = useState({});
    // const { user } =props

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
                } else { navigate("/") }

            })
            .catch(err => console.log(err))
    }
    return (
        <div>
            <h3> Edit {firstName}{lastName} </h3>

            <form onSubmit={updateUser} >
                <Link to={`/homepage`}> Home </Link><br />

                <label htmlFor="First Name" >First Name: </label>
                <input type="text" name="firstName" onChange={(e) => setFirstName(e.target.value)}
                value={firstName} /><br/>
                {/* { / * If I have an error display it it isfor validation * / }  */}
                <span> {errors.firstName ? errors.firstName.message : ''} </span>
                <br/>

                <label htmlFor="Last Name" > Last Name: </label>
                <input type="text" name="lastName" onChange={(e) => setLastName(e.target.value)}
                value={lastName}/><br/>
                <span> {errors.lasname ? errors.name.message : ''} </span>
                <br/>
                    
                <label htmlFor="address" > Address: </label>
                <input type="text" name="address" onChange={(e) => setAddress(e.target.value)}
                value={address}/> 
                <br/>
                    
                <label htmlFor="Type">  Type: </label>
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
                <br/>
                
                <input type="submit" value="Edit User"/>
            </form>
        </div>
    )


}