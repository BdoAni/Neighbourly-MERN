const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const stripe = require("stripe")("sk_test_51IalToAQmXzgarKridz5xLlSWttnLDuZNLHmmUtaXEEJYiONHMcigYHnKs9rJ077a0z7vTIr3a97mkRZB6UXk4Hs00N1B7oXa8");
const endpointSecret = 'whsec_FjtkgSil1DVY4wj4lLGHZyKeMACXTZ3T';

app.use(cors());
app.use(express.static('.'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const YOUR_DOMAIN = 'http://localhost:3000/checkout';

const calculateOrderAmount = items => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent people from directly manipulating the amount on the client
    // console.log(items);
    var total = 0;
    total = total + items;
    total = total * 100;

    return total;
};

app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    // console.log(items);
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        // metadata: {integration_check: 'accept_a_payment'}
    });
    res.send({
        clientSecret: paymentIntent.client_secret
    });
});
app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
    const event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
            request.body,
            signature,
            endpointSecret
        );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});


require('./config/mongoose.config');
require('./routes/project.routes')(app);
// require('./routes/project.routes')(app);
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

const server = app.listen(8000, () => console.log("Server's up and running!"));

const io = require('socket.io')(server, { cors: true })

io.on('connection', socket => {

    console.log('yay');
    
    socket.on('sendMessage', data => {
        // console.log('pls');
        socket.to(data.room).emit('messageSent', data);
    })

    socket.on('clientTyping', data => {
        // console.log('pls again')
        socket.to(data.room).emit('clientTyping', data);
    })

    socket.on('joinroom', data => {
        console.log(data);
        socket.join(data);
    })

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} has left the socket connection`)
    })
})