// import axios from 'axios';
import * as React from 'react';

class Cbutton extends React.Component
{
    public props: any;
    public state: any;


    constructor(props: any)
    {
        super(props);
        this.state = {
            classStr : this.props.origin,
            disabled : props.disabled,
            marked : false,
            id : props.id,
            origin : "",
            value : props.value,
        }
    }

    public render() 
    {
        return (
            <button key={this.props.id} >
                {this.props.value}
            </button>
        );
    }
}

export default Cbutton;