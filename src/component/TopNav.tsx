import * as React from 'react';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import postCall from '../helper/request';

class TopNav extends React.Component
{
    public props: any;
    public state: any;


    constructor(props: any)
    {
        super(props);
        this.state = {
            nickname : localStorage.getItem('nickname'),
            set : localStorage.getItem('set'),
        }
    }

    public createNew()
    {
        const param: any = {
            player : localStorage.getItem('id'),
        };

        postCall("room/add", param).then(data => {
            if(data.status === "OK")
            {
                window.location.href = '/room/' + data.data.id;
            }
        });
    }

    public render() 
    {
        return (
            <Row>
                <Nav variant="pills">
                    <Nav.Item>
                        <Nav.Link eventKey="home" href="/home">Home</Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link eventKey="setting" href="/setting">{this.state.set === null ? "Setting" : "Re-set"}</Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link eventKey="login" href="/login">{this.state.nickname === null ? "Login" : this.state.nickname}</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Button variant="success" onClick={this.createNew}>New Room</Button>
            </Row>
        );
    }
}
export default TopNav;