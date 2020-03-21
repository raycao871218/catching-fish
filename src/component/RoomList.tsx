import * as React from 'react';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import postCall from '../helper/request';
import Pusher from 'pusher-js'

class RoomList extends React.Component
{
    public state: any;
    constructor(props: any)
    {
        super(props);
        this.state = {
            list: {}
        };
        this.getList();
        this.subscribe();
    }

    public subscribe()
    {
        const that = this;
        const pusher = new Pusher('d7774b98bbac7a3c0065', {
            cluster: 'ap4',
            forceTLS: true
        });
        const channel = pusher.subscribe('catching-fish');

        channel.bind('roomlist', function(data: any) {
            console.log(data);

            that.setState({
                list: JSON.parse(data)
            });
        });
    }

    public renderItem(index: number, name: string, status: boolean = false)
    {
        // variant={i % 2 === 0 ? 'primary' : 'warning'} 
        // const i: number = 1;
        return(
            <a key={index} href={"/room/" + index}>
                <ListGroup.Item
                    variant={status ? 'success' : 'danger'} 
                    action={true}
                >
                    {name}
                </ListGroup.Item>
            </a>
        );
    }

    public renderList()
    {
        const body: any = [];
        const list: any = this.state.list;
        for(const one of list)
        {
            body.push(this.renderItem(one.id, one.name, one.status));
        }
        return body;
    }

    public render() 
    {
        return(
            <Row>
                <Col>
                    <ListGroup>
                        {this.renderList()}
                    </ListGroup>
                </Col>
            </Row>
        );
    }

    private getList = () =>
    {
        const that = this;

        postCall("room/list", []).then(data => {
            if(data.status === "OK")
            {
                that.setState({
                    list: data.data
                });
            }
        });

    };

}

export default RoomList;