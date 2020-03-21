import * as React from 'react';

import Container from 'react-bootstrap/Container';
import TopNav from './TopNav';
import RoomList from './RoomList';



class Home extends React.Component
{
    public render() 
    {
        return (

            <Container>
                <TopNav />
                <RoomList />
            </Container>

        );
    }
}
export default Home;