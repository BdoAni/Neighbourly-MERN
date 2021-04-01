import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, navigate } from '@reach/router';


export default props => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    // const [address, setAddress] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState({});


    useEffect(() => {
        axios.get(`http://localhost:8000/api/user/` + props.id)
            .then(res => {
                setFirstName(res.data.user.firstName);
                setLastName(res.data.user.lastName);
                // setAddress(res.data.user.address);
                setLoaded(true);
            })
    }, []);

    const updateUser = e => {
        e.preventDefault();
        axios.put(`http://localhost:8000/api/user/` + props.id, {
            firstName,
            lastName,
            // address,
        })
            .then(res => {
                console.log(res);
                if (res.data.errors) {
                    setErrors(res.data.errors)
                } else { navigate("/homepage") }

            })
            .catch(err => console.log(err))
    }
    return (
        <div>
            <Link to={`/homepage`}> Home </Link><br />
            <h3> Edit {firstName} {lastName} </h3>

            <form onSubmit={updateUser} >
                

                <p><label htmlFor="First Name" >First Name: </label>
                <input type="text" name="firstName" onChange={(e) => setFirstName(e.target.value)}
                value={firstName} />
                <span> {errors.firstName ? errors.firstName.message : ''} </span></p>
                
                <p><label htmlFor="Last Name" > Last Name: </label>
                <input type="text" name="lastName" onChange={(e) => setLastName(e.target.value)}
                value={lastName}/>
                <span> {errors.lastName ? errors.lastName.message : ''} </span></p>
                
                {/* <p><label htmlFor="address" > Address: </label>
                <input type="text" name="address" onChange={(e) => setAddress(e.target.value)}
                value={address}/> </p> */}
                <br/>
                <input type="submit" value="Edit User"/>
            </form>
        </div>
    )


}