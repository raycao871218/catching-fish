import * as React from 'react';

class Square extends React.Component
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
            <button
                key={this.props.id} 
                id={this.props.mark} 
                className={this.props.origin} 
                disabled={this.state.disabled}
                value={this.props.id}
                data-key={this.props.mkey}


                onClick={this.props.handleChildChange}
                onMouseOver={this.props.handleMouseOver}
            >
                {this.props.value}
            </button>
        );
    }
}

export default Square;