import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import Dashboard from './Dashboard';
// import './Search.css';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Dashboard} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);