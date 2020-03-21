import * as React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Home from './component/Home';
import Setting from './component/Setting';
import Room from './component/Room';
import Loginpage from './component/Loginpage';

import 'bootstrap/dist/css/bootstrap.min.css';


class Game extends React.Component 
{
    public state: any;
    public props: any;

    public constructor(props: any)
    {
        super(props);
    }

    public render()
    {
        return(
            <Router>
                <Switch>
                    <Route path="/home" component={Home} />
                    <Route path="/setting" component={Setting} />
                    <Route path="/room/:index" component={Room} />
                    <Route path="/login" component={Loginpage} />
                </Switch>
            </Router>
        );
    }
}

export default Game;
