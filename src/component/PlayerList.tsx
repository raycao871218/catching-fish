// import axios from 'axios';
import * as React from 'react';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

class PlayerList extends React.Component
{
    public props: any;
    public state: any;


    constructor(props: any)
    {
        super(props);
    }

    public renderList()
    {
        const body = [];
        let children = [];
        const player = localStorage.getItem('id');
        let playerId : number = 0;

        if(player !== null)
        {
            playerId = parseInt(player, 10);
        }

        let isYou: string = "";
        for(let i: number = 0; i < this.props.players.length; i++)
        {
            isYou = "";
            if(this.props.players[i].player_data.id === playerId)
            {
                isYou = "(YOU)"
            }
            children.push(
                <Col md="3">
                    <ListGroup>
                        <Button
                            id={this.props.players[i].player_data.id}
                            onClick={this.props.handlePlayerChange}
                        >{this.props.players[i].player_data.nickname + isYou}</Button>
                    </ListGroup>
                </Col>);
            if(i % 4 === 3 || i + 1 === this.props.players.length)
            {
                body.push(<Row className="m-1">{children}</Row>);
                children = [];
            }
        }
        return body;
    }

    public render() 
    {
        return (
            <Container>
                {this.renderList()}
            </Container>
        );
    }
}

export default PlayerList;