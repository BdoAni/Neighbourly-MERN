// Create
import Main from './views/Main';
//Create
import Create from './views/User/UserCreate';
import CreateTool from './views/Tool/ToolCreate';
import CreateReview from './views/Review/ReviewCreate';
//Edit
import Edit from './views/User/UserEdit';
// import Edit from './views/Tool/ToolEdit';
// import Edit from './views/Review/ReviewEdit';
//Detail
import Detail from './views/User/UserDetail';
// import Detail from './views/Tool/ToolDetail';
// import Detail from './views/ReviewDetail';

import Connect from './views/Connect';
// import Payments from './views/Payments';
import LoginRegister from './views/LoginRegister';
import { Link } from '@reach/router';
import { Router } from '@reach/router';
import React, { useState } from 'react';

import './App.css';

function App(props) {
    const [allusers, setAllUsers] = useState([]);

    return ( < div className = "App">
        <h1> Neighbourly </h1> 
        {/* <Link to = { `/homepage` } > back to home </Link> <br/> */}
        <Router >
        <LoginRegister path = "/"/>
        <Main path = "/homepage"/>
        <Create path = "/user/new" />
        <CreateTool path="/user/:id/new_tool"/>
        <CreateReview path = "/user/:id/new_review" />

        <Edit path = "/user/:id/edit" />
        {/* <EditTool path = "/user/:id/edit_review" />
        <EditReview path = "/user/:id/edit_review" /> */}

        <Detail path = "/users/:id" />
        {/* <DetailTool path = "/users/:id/detail_tool" />
        <DetailReview path = "/users/:id/detail_review" />  */}

        <Connect path = "/user/:id/connect"/>
        {/* <Payments path = "/user/:id/checkout"/> */}
        </Router>
        </div>
    );
}

export default App;