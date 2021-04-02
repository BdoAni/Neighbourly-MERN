import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import Chat from '../components/Chat';
import { Button } from '@material-ui/core';


const Connect = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    // const [address, setAddress] = useState("");
    const { id } = props;
    const [user, setUser] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/user/` + id)
            .then(res => {
                console.log(res.data)
                setUser(res.data.user);
                setFirstName(res.data.user.firstName);
                setLastName(res.data.user.lastName);
                // setAddress(res.data.user.address);
                // setType(res.data.user.type);
                // setDescription(res.data.user.description);
                // setPrice(res.data.user.price);
                setLoaded(true);
            })
            .catch(err => console.log(err.message))
    }, []);

    return (
        <div>
            <Button color="primary" variant="outlined" onClick={e => navigate(`/homepage`)}>Home</Button>
            <h3>Send a Message to {user.firstName} {user.lastName}</h3>
            <Chat id={id}/>
        </div>
    )
}

export default Connect

