import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { navigate } from '@reach/router';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core';

export default props => {
    const [allusers, setAllUsers] = useState([]);
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Axios.get(`http://localhost:8000/api/user`)
            .then(res => {
                console.log("**********", res)
                setAllUsers(res.data.results)
                setLoading(false)
            })
            .catch(err => console.log(err))
    }, []);

    if(loading){
        return(
            <p>Loading....</p>
        )
    }

    return (
        <div >
            <Button variant="outlined" onClick={e => navigate(`/`)}>Logout</Button>
            {/* < h1 > These users are looking for share tools</h1> */}
            {/* <Link to="/user/new" > Add a user to the list </Link> */}
            <h3 style={{textAlign: 'left'}}>Manage Your Tools:</h3>
            <center><Table className="table table-danger col-8 mx-auto">
                <TableHead>
                    <TableRow>
                        <TableCell> Placeholder </TableCell>
                        <TableCell> Placeholder </TableCell>
                        <TableCell> Placeholder </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                </TableBody>
            </Table></center>
            <h3 style={{textAlign: 'left'}}>Available Tools:</h3>
            <center><Table className="table table-danger col-8 mx-auto">
                <TableHead>
                    <TableRow>
                        <TableCell> Full Name </TableCell>
                        <TableCell> Type </TableCell>
                        <TableCell> Actions </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                allusers.map((user, index) => {
                    return (
                        <TableRow key={index}>
                            <TableCell> {user.firstName} {user.lastName} </TableCell>
                            <TableCell> {user?.tools?.type} </TableCell>
                            <TableCell>
                                <Button style={{marginRight: '5px'}} variant="outlined" color="primary" onClick={e => navigate(`/user/${user._id}`)}> Details </Button>
                                <Button style={{marginRight: '5px'}} variant="outlined" color="primary" onClick={e => navigate(`/user/${user._id}/edit`)}> Edit </Button>
                                <Button style={{marginRight: '5px'}} variant="outlined" color="primary" onClick={e => navigate(`/user/${user._id}/connect`)}> Connect </Button>
                                <Button variant="outlined" color="primary" onClick={e => navigate(`/user/${user._id}/new_tool`)}> Add Tool </Button>
                            </TableCell>
                        </TableRow>)
                })
                }
                </TableBody>
            </Table></center>
        </div>
    )
}