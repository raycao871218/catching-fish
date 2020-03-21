export function originMatrixArr(direction: string){
    let origin: number[][] = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ];
    switch(direction)
    {
        case "top":
            origin = [
                [0, 0, 1, 0, 0],
                [1, 1, 1, 1, 1],
                [0, 0, 1, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0],
            ];
            break;
        case "right":
            origin = [
                [0, 0, 0, 1, 0],
                [0, 1, 0, 1, 0],
                [0, 1, 1, 1, 1],
                [0, 1, 0, 1, 0],
                [0, 0, 0, 1, 0],
            ];
            break;
        case "down":
            origin = [
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 1, 0, 0],
                [1, 1, 1, 1, 1],
                [0, 0, 1, 0, 0],
            ];
            break;
        case "left":
            origin = [
                [0, 1, 0, 0, 0],
                [0, 1, 0, 1, 0],
                [1, 1, 1, 1, 0],
                [0, 1, 0, 1, 0],
                [0, 1, 0, 0, 0],
            ];
            break;
    }
    return origin;
}

export function getXY(key: string)
{
    const xy: string[] = key.split("-");
    return [parseInt(xy[0], 10), parseInt(xy[1], 10)];
}

function getDirection(caculationResult: any)
{
    let direction: string = "";

    if(caculationResult.max.x - caculationResult.min.x > caculationResult.max.y - caculationResult.min.y)
    {
        if(Math.abs(caculationResult.wings.x - caculationResult.max.y) > 1)
        {
            direction = "top";
        }
        else
        {
            direction = "down";
        }
    }
    else
    {
        if(Math.abs(caculationResult.wings.y - caculationResult.max.x) > 1)
        {
            direction = "left";
        }
        else
        {
            direction = "right";
        }
    }
    return direction;
}

export function rotateMatrix(matrix: number[][], isClockwise: boolean)
{
    return isClockwise ? clockwise(matrix) : counterclockwise(matrix);
}

function clockwise(matrix: number[][])
{
    const newMatrix: number[][] = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ];
    for(let i: number = 0; i < matrix.length; i++)
    {
        for(let j: number = 0; j < matrix[i].length; j++)
        {
            newMatrix[j][4 - i] = matrix[i][j];
            // newMatrix[4 - i][j] = matrix[j][i];
        }
    }
    return newMatrix;
}

function counterclockwise(matrix: number[][])
{
    const newMatrix: number[][] = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ];
    for(let i: number = 0; i < matrix.length; i++)
    {
        for(let j: number = 0; j < matrix[i].length; j++)
        {
            // newMatrix[j][4 - i] = matrix[i][j];
            newMatrix[4 - i][j] = matrix[j][i];
        }
    }
    return newMatrix;
}

export function getOffset(caculationResult : any)
{
    const direction: string = getDirection(caculationResult);
    let lineFixX: number = 0;
    let lineFixY: number = 0;

    switch(direction)
    {
        case "top":
            lineFixY = caculationResult.max.y > 6 ? -1 : 0;
            break;
        case "down":
            lineFixY = caculationResult.min.y === 1 ? 0 : -1;
            break;
        case "left":
            lineFixX = caculationResult.max.x > 6 ? -1 : 0;
            break;
        case "right":
            lineFixX = caculationResult.min.x === 1 ? 0 : -1;
            break;
    }

    return {
        "direction" : direction,
        "x" : caculationResult.min.x + lineFixX,
        "y" : caculationResult.min.y + lineFixY
    };
}

export function matrixCaculator(matrixRaw: string[])
{
    let minY: number = 0;
    let maxY: number = 0;
    let minX: number = 0;
    let maxX: number = 0;
    let tmpArr: number[];
    let wingY : number = 0;
    let wingX : number = 0;

    for(const one of matrixRaw)
    {
        tmpArr = getXY(one);
        minX = minX > tmpArr[0] || minX === 0 ? tmpArr[0] : minX;
        if(maxX < tmpArr[0] || maxX === 0)
        {
            maxX = tmpArr[0];
            wingX =  tmpArr[1];
            
        }
        

        minY = minY > tmpArr[1] || minY === 0 ? tmpArr[1] : minY;
        if(maxY < tmpArr[1] || maxY === 0)
        {
            maxY = tmpArr[1];
            wingY =  tmpArr[0];
        }
    }

    return {
        "wings": {"x": wingX, "y": wingY},
        "max" : {"x": maxX, "y": maxY},
        "min" : {"x": minX, "y": minY}
    };
}

export function getCenter(caculationResult: any)
{
    const direction: string = getDirection(caculationResult);
    let x: number = 0;
    let y: number = 0;
    switch(direction)
    {
        case "top":
        case "down":
            x = (caculationResult.max.x + caculationResult.min.x) / 2;
            y = caculationResult.wings.x;
            break;
        case "left":
        case "right":
            x = caculationResult.wings.y;
            y = (caculationResult.max.y + caculationResult.min.y) / 2;
            break;
    }
    return x + "-" + y;
}

export function getDistanceOffset(center: string, target: string)
{
    const centerArr: number[] = getXY(center);
    const targetArr: number[] = getXY(target);
    return [targetArr[0] - centerArr[0], targetArr[1] - centerArr[1]];
}

export function matrixMove(matrix: string[], offset: number[])
{
    let tmp: number[];
    const newMatrix: string[] = [];
    for(const one of matrix)
    {
        tmp = getXY(one);
        if((tmp[0] + offset[0]) <= 0 || (tmp[0] + offset[0]) > 10 || (tmp[1] + offset[1]) <= 0 || (tmp[1] + offset[1]) > 10)
        {
            return matrix;
        }
        newMatrix.push((tmp[0] + offset[0]) + "-" + (tmp[1] + offset[1]));
    }
    return newMatrix;
}