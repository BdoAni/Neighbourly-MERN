import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import { Table, TableBody, TableCell, TableHead, TableRow, Button,} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });


export default props => {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const { id } = props;
    const [tools, setTools]= useState({});
    const [reviews, setReviews]=useState({});
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/user/` + id)
            .then(res => {
                console.log(res.data)
                setUser(res.data.user);
                setFirstName(res.data.user.firstName);
                setLastName(res.data.user.lastName);
                setAddress(res.data.user.address);
                setType(res.data.user.type);
                setDescription(res.data.user.description);
                setPrice(res.data.user.price);
                setTools(res.data.user.tools);
                setReviews(res.data.user.reviews);
                setLoading(false);
            })
            .catch(err => console.log(err.message))
    }, []);

    const deleteUser = (userId) => {
        axios.delete(`http://localhost:8000/api/user/` + userId)
            .then(res => {
                navigate('/homepage')
            })
    }
    const reviewUser = (userId) => {
        axios.post(`http://localhost:8000/api/user/$id/review` )
            .then(res => {
                navigate(`/user/${userId}/new_review`) //create a review for user
            })
    }
    console.log(tools)

    if(loading){
        return(
            <p>Loading....</p>
        )
    }
    return (
        <div>
            <Button color="primary" variant="outlined" onClick={e => navigate(`/homepage`)}>Home</Button>
            <h2>Details for {firstName} {lastName}</h2>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography color="textSecondary">
                    First Name:
                    </Typography>
                    <Typography className={classes.pos} variant="h5" component="h2">
                    {firstName}
                    </Typography>
                    <Typography color="textSecondary">
                    Last Name:
                    </Typography>
                    <Typography className={classes.pos} variant="h5" component="h2">
                    {lastName}
                    </Typography>
                    <Typography color="textSecondary">
                    Address:
                    </Typography>
                    <Typography className={classes.pos} variant="h5" component="h2">
                    {address}
                    </Typography>
                </CardContent>
                </Card>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tool Type</TableCell>
                        <TableCell>Tool Description</TableCell>
                        <TableCell>Tool Price</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        user.tools.map((tool, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>{tool.type}</TableCell>
                                    <TableCell>{tool.description}</TableCell>
                                    <TableCell>{tool.price}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="primary" onClick={e => navigate(`/user/${user._id}/tool/${tool._id}/checkout`)}>Rent Tool</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
            <br/>
            <br/>
            <center><Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Reviewer</TableCell>
                        <TableCell>User Rating</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <tbody>
                    {
                        user.reviews.map((review, i) => {
                            return (
                                <tr key={i}>
                                    <td>{review.name}</td>
                                    <td><center>{review.rating}</center></td>
                                    {/* <td>{review.review}</td> */}
                                    <td>
                                        <Link to={`/user/${user._id}/review/${review._id}/`}><button>Read Review</button> </Link>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table></center>



            <br/>
            <br/>
            <Button variant="contained" color="primary" onClick={(e) => reviewUser(user._id)}> Write a review for {firstName} </Button> <br/> <br/>

            <Button variant="contained" color="primary" onClick={(e) => deleteUser(user._id)}> Delete {firstName} </Button>

        </div>
    )
}