import React, { Component, useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, useParams, Link } from 'react-router-dom';
import Entry from './Pages/Entry';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Logout from './Pages/Logout';
import Home from './Pages/Home';
import Edit from './Pages/Edit';
import View from './Pages/View/View.js';

import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Entry/>
        </Route>
        <Route exact path="/login">
          <Login/>
        </Route>
        <Route exact path="/logout">
          <Logout/>
        </Route>
        <Route exact path="/register">
          <Register/>
        </Route>
        <Route exact path="/dashboard">
          <Home/>
        </Route>
        <Route path="/edit/:name">
          <Edit/>
        </Route>
        <Route path="/view/:name">
          <View/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
