import * as React from 'react';
import PlayerList from './PlayerList';
import CheckerBoard from './CheckerBoard';
import Container from 'react-bootstrap/Container';
import TopNav from './TopNav';
import Pusher from 'pusher-js'
import Button from 'react-bootstrap/Button';

import postCall from '../helper/request';

class Room extends React.Component
{
    public state: any;
    public props: any;

    public constructor(props: any)
    {
        super(props);
        this.state = {
            status : "gaming",
            settingMatrix : [],
            players: [],
            self: [],
            owner: 0,
            stage: "",
            hit:{},
            miss:{},
            destroy:{},
            viewing: 0,
            turn: 0,
            nextplayername: "",
        };

        this.initList();
        this.subscribe();
        this.hitsub();
        this.startGame = this.startGame.bind(this)
        this.hitAction = this.hitAction.bind(this)
    }

    public hitAction(event: any)
    {

        const player = localStorage.getItem('id');
        let playerId : number = 0;

        if(player !== null)
        {
            playerId = parseInt(player, 10);
        }
        if(this.state.viewing === playerId)
        {
            return;
        }
        const that = this;

        const hitlog = this.state.hit;
        if(hitlog.hasOwnProperty(that.state.viewing))
        {
            Object.keys(hitlog).forEach(function(key){
                if(parseInt(key, 10) === that.state.viewing && hitlog[key].indexOf(event.target.value) === -1)
                {
                    // hitlog[key].push(event.target.value);
                    that.sendHit(event.target.value);
                }
            });
        }
        else
        {
            // hitlog[that.state.viewing] = [event.target.value];
            that.sendHit(event.target.value);
        }
        this.setState({
            hit: hitlog
        });
    }

    public sendHit(targetpoint: string)
    {
        const that = this;
        const url = "game/" + this.props.match.params.index + "/" + localStorage.getItem('id') + "/hit";
        const param: any = {
            target : that.state.viewing,
            point : targetpoint,
        };
        postCall(url, param).then(data => {
            if(data.status === "OK")
            {
                that.setState({
                    miss: data.data.miss,
                    destroy: data.data.headshort,
                    hit: data.data.bodyshort,
                    turn: data.data.next,
                    nextplayername: data.data.nextPlayer.nickname,

                });
            }
        });
    }

    public initList = () =>
    {
        const that = this;

        const url = "room/" + this.props.match.params.index + "/feed";
        const param: any = {
            player : localStorage.getItem('id'),
        };

        postCall(url, param).then(data => {
            if(data.status === "OK")
            {
                that.setState({
                    settingMatrix: data.data.self.setting,
                    players: data.data.players,
                    self: data.data.self.setting,
                    owner: data.data.player,
                    stage: data.data.status,
                    viewing: parseInt(data.data.self.id, 10),
                    miss: data.data.miss,
                    destroy: data.data.headshort,
                    hit: data.data.bodyshort,
                });
            }
        });
    };

    

    public handlePlayerChange(event: any)
    {
        const player = localStorage.getItem('id');

        if(player !== null)
        {
            if(parseInt(player, 10) === parseInt(event.target.id, 10))
            {
                this.setState({
                    settingMatrix: this.state.self,
                    viewing: parseInt(event.target.id, 10),
                });
                return;
            }
            this.setState({
                settingMatrix: [],
                viewing: parseInt(event.target.id, 10),
            });
        }
    }

    public getPlayerSetting(id: string)
    {
        for(const one of this.state.players)
        {
            if(parseInt(one.player_data.id, 10) === parseInt(id, 10))
            {
                return one.player_data.setting;
            }
        }
        return [];
    }

    public hitsub()
    {
        const that = this;
        const pusher = new Pusher('d7774b98bbac7a3c0065', {
            cluster: 'ap4',
            forceTLS: true
        });
        const channel = pusher.subscribe('catching-fish');

        channel.bind('hitfeed', function(response: any) {

            const json = JSON.parse(response);

            if(json.status === "OK")
            {
                that.setState({
                    stage : "ongoing",
                    miss: json.data.miss,
                    destroy: json.data.headshort,
                    hit: json.data.bodyshort,
                    turn: json.data.next,
                    nextplayername: json.data.nextPlayer.nickname,

                });
            }
        });
    }

    public subscribe()
    {
        const that = this;
        const pusher = new Pusher('d7774b98bbac7a3c0065', {
            cluster: 'ap4',
            forceTLS: true
        });
        const channel = pusher.subscribe('catching-fish');

        channel.bind('roomfeed', function(response: any) {

            const json = JSON.parse(response);
            if(json.status === "OK")
            {
                console.log(json.data);
                that.setState({
                    // settingMatrix: json.data.self.setting,
                    players: json.data.players,
                    // self: json.data.self.setting,
                    owner: json.data.player,
                    stage: json.data.status,
                    turn: json.data.next,
                });
            }
        });
    }

    public startGame(event: any)
    {
        const that = this;
        const url = "room/" + this.props.match.params.index + "/start";
        const param: any = {
            player : localStorage.getItem('id'),
        };

        postCall(url, param).then(data => {
            if(data.status === "OK")
            {
                that.setState({
                    stage: "ongoing"
                });
            }
        });
    }

    public renderStart()
    {
        const player = localStorage.getItem('id');
        let playerId : number = 0;

        if(player !== null)
        {
            playerId = parseInt(player, 10);
        }

        if(this.state.stage === 'pending' && this.state.owner === playerId)
        {

            return (
                <Button onClick={this.startGame}>START GAME</Button>
            );
        }
        return "";
    }
    public turn()
    {
        const player = localStorage.getItem('id');
        let playerId : number = 0;

        if(player !== null)
        {
            playerId = parseInt(player, 10);
        }

        if(playerId === this.state.turn)
        {
            return (<p>Your turn</p>);
        }
        return (<p>player {this.state.nextplayername} 's turn</p>);
    }
    
    public render() 
    {
        const that = this;
        return(

            <Container>
                <TopNav />
                {this.renderStart()}
                {this.turn()}
                <CheckerBoard 
                    status={this.state.status}
                    matrix={this.state.settingMatrix}
                    hit={this.state.hit}
                    destroy={this.state.destroy}
                    miss={this.state.miss}
                    viewing={this.state.viewing}
                    hitAction={this.hitAction}
                    stage={this.state.stage}
                />
                <PlayerList 
                    players={this.state.players}
                    handlePlayerChange={this.handlePlayerChange.bind(that)}
                />

            </Container>
        );
    }
}
export default Room;