import axios from 'axios';
import CONSTANS from "../config/golobals"

function postCall(url: string, param: any = [])
{
    let postUrl = "";
    if(CONSTANS.ENV === 'production')
    {
        postUrl = CONSTANS.HOST;
    }
    postUrl += CONSTANS.PREFIX + "/" + url;

    return axios.post(postUrl, param).then(response =>
    {
        const json = response.data;
        if(json.status === "OK")
        {
            return json;
        }
    });
}
export default postCall;