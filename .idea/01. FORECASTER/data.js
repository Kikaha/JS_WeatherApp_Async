function hostAddress(endpoint){
    return `https://judgetests.firebaseio.com/${endpoint}.json`;
}

const apiEndpoints = {
    location: function(){return 'locations'},
    forecastToday: function(code){ return `forecast/today/${code}`},
    forecastUpcoming: function(code){return `forecast/upcoming/${code}`}
}

const locations = [
    {"code": "ny", "name": "New York"},
    {"code": "london", "name": "London"},
    {"code": "barcelona", "name": "Barcelona"}
];

let _code = "";

export async function getCode(name){
    // https://judgetests.firebaseio.com/locations.json
    // {mode: 'no-cors'}
    const code = (await (await fetch(hostAddress(apiEndpoints.location()))).json())
        .find(x=>x.name===name).code;
    console.log(code);
    // const dataCode = (await (await fetch(hostAddress(apiEndpoints.location()))).json())
    //     .find(x=>x.name===name).code;
    // const result = await response.json();
    _code = code;
    return code;
    // return locations.find(x=>x.name===name).code;
    //  return "london";
}

export async function getToday(code){
    return (await (await fetch(hostAddress(apiEndpoints.forecastToday(_code)))).json());
 // return {
 //          "forecast": {"condition":"Rain","high":"8","low":"2"},
 //          "name":"London, UK"
 //        };
}

export async function getUpcoming(code){
    return await (await fetch(hostAddress(apiEndpoints.forecastUpcoming(_code)))).json();
// return {"forecast":
//            [{"condition":"Rain","high":"8","low":"6"},
//             {"condition":"Rain","high":"11","low":"3"},
//             {"condition":"Rain","high":"8","low":"5"}],
//         "name":"London"};
}