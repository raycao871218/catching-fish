import * as React from 'react';
import keydown from 'react-keydown';

import Square from './Square';
import {intersection} from "../helper/math";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'



import {getCenter, getDistanceOffset, getOffset, matrixCaculator, matrixMove, originMatrixArr, rotateMatrix} from "../helper/matrix";

class CheckerBoard extends React.Component
{
    public props: any;
    public state: any;

    private headline: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    constructor(props: any)
    {
        super(props);
        this.state = {
            hoverIndex : -1,
            errorIndex : -1,
            marked : this.props.matrix
        }

        this.handleSettingChange = this.handleSettingChange.bind(this)
    }

    public renderSquare(id: string, i: string, mkey: string, disabled: boolean = false, key: number = 0) 
    {
        const that = this;
        const remarked: string[][] = this.props.matrix;

        let setMark: boolean = false;
        let setOrigin: string = "square";
        let listIndex = -1;
        for(let list: number = 0; list < remarked.length; list++)
        {
            if(this.props.matrix[list].indexOf(id) !== -1)
            {
                setMark = true;
                if(list === this.state.hoverIndex)
                {
                    setOrigin += " setting";
                }
                if(list === this.state.errorIndex)
                {
                    setOrigin += " error-setting";
                }
                setOrigin += " set";
                listIndex = list;
                break;
            }
        }

        if(this.props.stage === "ongoing")
        {
            const hitmatrix = this.props.hit;
            const destroyMatrix = this.props.destroy;
            const missMatrix = this.props.miss;
            Object.keys(hitmatrix).forEach(function(index){
                if(parseInt(index, 10) === parseInt(that.props.viewing, 10))
                {
                    if(hitmatrix[index].indexOf(id) !== -1)
                    {
                        setOrigin += " hit";
                    }
                }
            });

            Object.keys(destroyMatrix).forEach(function(index){
                if(parseInt(index, 10) === parseInt(that.props.viewing, 10))
                {
                    if(destroyMatrix[index].indexOf(id) !== -1)
                    {
                        setOrigin += " destroy";
                    }
                }
            });

            Object.keys(missMatrix).forEach(function(index){
                if(parseInt(index, 10) === parseInt(that.props.viewing, 10))
                {
                    if(missMatrix[index].indexOf(id) !== -1)
                    {
                        setOrigin += " miss";
                    }
                }
            });
        }
        // debugge
        return <Square
                    id={id} 
                    value={i} 
                    disabled={disabled} 
                    marked={setMark} 
                    origin={setOrigin}
                    mark={listIndex}
                    mkey={mkey}
                    handleChildChange={this.handleChildChange.bind(that)}
                    handleMouseOver={this.handleMouseOver.bind(that)}
                />;
    }

    @keydown("left")
    public counterclockwise()
    {
        if(this.state.hoverIndex >= 0)
        {
            this.reloveMatrix(this.state.hoverIndex, false);
        }
    }

    @keydown("right")
    public clockwise()
    {
        if(this.state.hoverIndex >= 0)
        {
            this.reloveMatrix(this.state.hoverIndex, true);
        }
    }

    public handleMouseOver(event: any)
    {
        if(this.state.hoverIndex >= 0)
        {
            const remarked = this.props.matrix;

            const matrixRaw: string[] = remarked[this.state.hoverIndex];
            const center: string = getCenter(matrixCaculator(matrixRaw));

            const offset = getDistanceOffset(center, event.target.value);

            remarked[this.state.hoverIndex] = matrixMove(matrixRaw, offset);

            for(let i: number = 0; i < remarked.length; i++)
            {
                if(i === this.state.hoverIndex)
                {
                    continue;
                }
                else
                {
                    if(intersection(remarked[this.state.hoverIndex], remarked[i]).length > 0)
                    {
                        return ;
                    }
                }
            }
            console.log(remarked);
            this.setState({
                marked : remarked
            });
        }

    }

    public handleChildChange(event: any)
    {
        if(this.props.status === "setting")
        {
            const id: number = parseInt(event.target.id, 10);

            if(id < 0)
            {
                return;
            }
            this.setState({
                hoverIndex : this.state.hoverIndex >= 0 ? -1 : id,
            });
        }
        else
        {
            this.props.hitAction(event);
        }
    }

    public reloveMatrix(index : number, clockwise: boolean)
    {
        const remarked = this.props.matrix;
        const matrixRaw: string[] = remarked[index];

        const offset = getOffset(matrixCaculator(matrixRaw));
        const newMatrix = rotateMatrix(originMatrixArr(offset.direction), clockwise);
        
        remarked[index] = this.setOffset(newMatrix, [offset.x, offset.y]);

        this.setState({
            marked : remarked
        });
    }

    public setOffset(matrix: number[][], offset: number[])
    {
        const newMatrix: string[] = [];

        for(let i: number = 0; i < matrix.length; i++)
        {
            for(let j: number = 0; j < matrix[i].length; j++)
            {
                if(matrix[i][j] === 1)
                {
                    newMatrix.push((j + offset[0]).toString() + "-" + (i + offset[1]).toString());
                }
            }
        }
        return newMatrix;
    }

    public createBoard = () => {
        const table = [];
        for(let i = 0; i < 11; i++)
        {
            const children = [];
            for(let j = 0; j < 11; j++)
            {
                const id: string = j.toString() + "-" + i.toString();
                const mkey: string = this.headline[j - 1] + "-" + i.toString();
                if(i === 0 && j === 0)
                {
                    children.push(this.renderSquare(id, "", "", true));
                    continue;
                }

                if(i === 0)
                {
                    children.push(this.renderSquare(id, this.headline[j - 1], "", true));
                    continue;
                }
                if(j === 0)
                {
                    children.push(this.renderSquare(id, i.toString(), "", true));
                    continue;
                }
                children.push(this.renderSquare(id, "", mkey));
            }
        table.push(<Row><Col><div key={"board-" + i} className="board-row">{children}</div></Col></Row>);
        }
        return table;
    }

    public handleSettingChange(event: any)
    {
        const settings : string = JSON.stringify(this.props.matrix);
        this.props.handleSetting(settings)
    }

    public attachButton()
    {
        if(this.props.status === "setting")
        {
            return (<Button onClick={this.handleSettingChange}>Submit</Button>);
        }
        return "";
    }

    public render() 
    {
        return (
            <div className="m-3" key="board">
                <Row key={this.props.id}>
                    <p key="status">{this.props.status} Mod</p>
                </Row>
                {this.createBoard()}
                <Row>
                    {this.attachButton()}
                </Row>
            </div>
        );
    }
}

export default CheckerBoard;