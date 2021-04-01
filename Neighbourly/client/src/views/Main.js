import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link } from '@reach/router';

export default props => {
    const [allusers, setAllUsers] = useState([]);
    const [tools, setTools] = useState([]);

    useEffect(() => {
        Axios.get(`http://localhost:8000/api/user`)
            .then(res => {
                console.log("**********", res)
                setAllUsers(res.data)
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div >
            <a href="/">Logout</a>
            < h1 > These users are looking for share tools</h1>
            <Link to="/user/new" > Add a user to the list </Link>
            <br/>
            <br/>
            <center><table className="table table-danger col-8 mx-auto">
                <tr>
                    <th> Full Name </th>
                    <th > Type </th>
                    <th > Actions </th>
                </tr>
                {
                allusers.map((user, index) => {
                    return (
                        <tr key={index}>
                            <td> {user.firstName} {user.lastName} </td>
                            <td > {user?.tools?.type} </td>
                            <td >
                                < Link to={`/users/${user._id}`} > < button> Details </button></Link > |
                                < Link to={`/user/${user._id}/edit`} > <button> Edit </button></Link > |
                                < Link to = { `/user/${user._id}/connect` } ><button> Connect </button></Link >
                                < Link to={`/user/${user._id}/new_tool`} > <button> Add Tool </button></Link >
                            </td>
                        </tr>)
                })
                }
            </table></center>
        </div>
    )
}