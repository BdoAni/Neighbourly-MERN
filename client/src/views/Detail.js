import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, navigate } from '@reach/router';


export default props => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const { id } = props;
    const [user, setUser] = useState({});
    const [tools, setTools] = useState({});
    const [loaded, setLoaded] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/user/` + id)
            .then(res => {
                setUser(res.data.user);
                setFirstName(res.data.user.firstName);
                setLastName(res.data.user.lastName);
                setAddress(res.data.user.address);
                setType(res.data.user.type);
                setDescription(res.data.user.description);
                setPrice(res.data.user.price);
                setTools(res.data.user.tools);
                setLoaded(false);
            })
            .catch(err => console.log(err.message))
    }, []);

    const deleteUser = (userId) => {
        axios.delete(`http://localhost:8000/api/user/` + userId)
            .then(res => {
                navigate('/homepage')
            })
    }

    if (loaded) {
        return (
            <p>Loading....</p>
        )
    }

    return (
        <div>
            <h2>Details for {firstName}{lastName}</h2>
            <Link to={`/homepage`}> Home </Link><br />

            <label htmlFor="First Name" >First Name: {firstName}</label>
            <br />

            <label htmlFor="Last Name" > Last Name: {lastName}</label>
            <br />

            <label htmlFor="Address" > Address: {address}</label>
            <br />


            <table>
                <thead>
                    <tr>
                        <th>Tool Type</th>
                        <th>Tool Description</th>
                        <th>Tool Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tools.map((tool, i) => {
                            return (
                                <tr key={i}>
                                    <td>{tool.type}</td>
                                    <td>{tool.description}</td>
                                    <td>{tool.price}</td>
                                    <td>
                                        <Link to={`/user/${user._id}/tool/${tool._id}/checkout`}><button>Rent Tool</button> </Link>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            <button onClick={(e) => deleteUser(user._id)}> Delete {firstName} </button>

        </div>
    )
}