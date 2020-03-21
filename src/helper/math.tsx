export function intersection(a: any, b: any)
{
    return a.filter(function(v: any){ return b.indexOf(v) > -1 });
}
