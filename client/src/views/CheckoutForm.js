import React, { useState, useEffect } from "react";
import {
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import "./Stripe.css";
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import { Button } from '@material-ui/core';
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


export default function CheckoutForm(props) {
    const classes = useStyles();
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const [email, setEmail] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(true);
    const [thisUser, setThisUser] = useState({})
    const [thisTool, setThisTool] = useState({})
    const [thisToolPrice, setThisToolPrice] = useState(1)
    const { user, tool, toolPrice } = props;

    useEffect(() => {
        axios.get(`http://localhost:8000/api/user/${user}`)
            .then(res => {
                // console.log(res);
                setThisUser(res.data.user);
                // setThisTool(res.data.user.tools);
                setLoading(false);
            })
            .catch(err => console.log(err))
    }, []);

    useEffect(()=> {
        axios.get(`http://localhost:8000/api/tool/${tool}`)
            .then(res => {
                // console.log(res);
                setThisTool(res.data.results);
                setThisToolPrice(res.data.results.price);
            })
    }, []);

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        window.fetch("http://localhost:8000/create-payment-intent", { //api/userid/toolid/
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({items: [toolPrice]})
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                setClientSecret(data.clientSecret);
            });
    }, []);
    

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    const handleChange = async (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    };

    const handleSubmit = async ev => {
        ev.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        }
    };

    // console.log(toolPrice);

    if (loading) {
        return (
            <p>Loading....</p>
        )
    }


    return (
        <>
        <div>
            <Button style={{marginRight: "5px"}} color="primary" variant="outlined" onClick={e => navigate(`/homepage`)}>Home</Button>
            <Button color="primary" variant="outlined" onClick={e => navigate(`/user/${thisUser._id}`)}>{thisUser.firstName}'s details page</Button>
            <h3>Confirmation</h3>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography variant="body1" component="p">
                    You are about to rent the {thisTool.type}
                    </Typography>
                    <Typography variant="body1" component="p">
                    from {thisUser.firstName} {thisUser.lastName} for ${thisTool.price} a day.
                    </Typography>
                </CardContent>
                </Card>
            <h4>If this is correct, please enter your card information below</h4>
        <form id="payment-form" class="form" onSubmit={handleSubmit}>
            <input type="text" class="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={thisUser.email} />
            <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
            <button disabled={processing || disabled || succeeded} id="submit" class="button">
                <span id="button-text">
                    {processing ? (
                        <div className="spinner" id="spinner"></div>
                    ) : (
                        "Pay now"
                    )}
                </span>
            </button>
            {/* Show any error that happens when processing the payment */}
            {error && (
                <div className="card-error" role="alert">
                    {error}
                </div>
            )}
            {/* Show a success message upon completion */}
            <p className={succeeded ? "result-message" : "result-message hidden"}>
                Payment succeeded, see the result in your
                <a href={`https://dashboard.stripe.com/test/payments`}>{" "} Stripe dashboard.</a> 
                Refresh the page to pay again.
            </p>
        </form>
        </div>
        </>
    );
}
