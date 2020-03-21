import * as React from 'react';
import CheckerBoard from './CheckerBoard';
import Container from 'react-bootstrap/Container';
import TopNav from './TopNav';
import postCall from '../helper/request';

class Setting extends React.Component
{
    public state: any;

    public constructor()
    {
        super([]);
        this.state = {
            status : "setting",
            settingMatrix : [],
        };
        this.initList();
    }

    public initList = () =>
    {
        const that = this;
        const param: any = {
            player : localStorage.getItem('id'),
        };

        postCall("player/setting/get", param).then(data => {
            if(data.status === "OK")
            {
                that.setState({
                    settingMatrix: data.data.setting
                });
            }
        });
        
    };

    public handleSetting(settingJson: string)
    {
        const param: any = {
            player : localStorage.getItem('id'),
            setting : settingJson
        };

        postCall("player/setting/add", param).then(data => {
            if(data.status === "OK")
            {
                localStorage.setItem('set', "true");
                window.location.href = '/home';
            }
        });
    }

    public render() 
    {
        const that = this;

        return(
            <Container>
                <TopNav />
                <div className="game">
                    <div className="game-board">
                        <CheckerBoard 
                            status={this.state.status} 
                            handleSetting={this.handleSetting.bind(that)}
                            matrix={this.state.settingMatrix}
                        />
                    </div>
                </div>
            </Container>
        );
    }

}

export default Setting;