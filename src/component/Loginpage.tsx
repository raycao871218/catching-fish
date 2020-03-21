import * as React from 'react';
import Container from 'react-bootstrap/Container';
import TopNav from './TopNav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import postCall from '../helper/request';


class Loginpage extends React.Component
{
    public state: any;
    public props: any;

    public constructor(props: any)
    {
        super(props);
        this.state = {
            nickname: "",
        };
        this.handelChange = this.handelChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public handleSubmit()
    {
        const param: any = {
            nickname: this.state.nickname
        };

        postCall("player/register", param).then(data => {
            if(data.status === "OK")
            {
                localStorage.setItem('id', data.data.id);
                localStorage.setItem('nickname', data.data.nickname);
                if(data.data.set === false)
                {
                    localStorage.removeItem("set");
                }
                window.location.href = '/home';
            }
        });
    }

    public handelChange(event: any)
    {
        const that = this;
        that.setState({
            nickname: event.target.value
        });
    }
    
    public render() 
    {
        return(
            <Container>
                <TopNav />
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control 
                            type="Nickname" 
                            name="nickname" 
                            placeholder="Nickname" 
                            onChange={this.handelChange}
                            defaultValue={this.state.nickname} 
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        Submit
                    </Button>
            </Container>
        );
    }
}
export default Loginpage;