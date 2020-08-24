import * as dataApi from './data.js'
import el from './dom.js'

const symbols = {
'Sunny':'&#x2600;',
'Partly sunny': '&#x26C5;',
'Overcast': '&#x2601;',
'Rain':	'&#x2614;',
'Degrees':'&#176;'
}

window.addEventListener('load', () => {
    const elements = {
        main: function () {
            return document.querySelector("#forecast")
        },
        current: function () {
            return document.querySelector("#current")
        },
        upcoming: function () {
            return document.querySelector("#upcoming")
        },
        inputLocation: function () {
            return document.querySelector("body input#location")
        }
    }

    document.querySelector("body input#submit").addEventListener("click", getForecast);

    async function getForecast() {
        console.log("Begin...")
        const location = elements.inputLocation().value;
        const code = await dataApi.getCode(location);
        // const result = await Promise.all([
        //     dataApi.getToday(code),
        //     dataApi.getUpcoming(code)]);
        // will start both requests simultaneously, but will be resolved when both are ready.
        // const today = await dataApi.getToday(code);
        // const upcoming = await dataApi.getUpcoming(code);

        //other way will be to be started without await.
        const todayP = dataApi.getToday(code);
        const upcomingP = dataApi.getUpcoming(code);
        const result = [
            await todayP,
            await upcomingP
        ];
        console.log(result);

        const[today,upcoming] = result;

        let symbolNodeToInnerHtml = el("span","",{className: 'condition symbol'});
        symbolNodeToInnerHtml.innerHTML = symbols[today.forecast.condition];
        let symbolNodeInnerHtmlSymbol = el("span","",{className: 'forecast-data'});
        symbolNodeInnerHtmlSymbol.innerHTML = `${today.forecast.low}${symbols.Degrees}/
                                       ${today.forecast.high}${symbols.Degrees}`;

        let finalElement = el("div",[
            symbolNodeToInnerHtml,
            el("span",[
                el("span",today.name,{className: 'forecast-data'}),
                symbolNodeInnerHtmlSymbol,
                el("span",today.forecast.condition,{className: 'forecast-data'}),
            ],{className:'condition'})
        ],{className: 'forecast'})

        elements.main().style.display = "block";

        elements.current().appendChild(finalElement);

        function renderUpcoming(forecast){
            let symbolNodeToInnerHtml =  el("span",'',{className:"symbol"});
            symbolNodeToInnerHtml.innerHTML = symbols[forecast.condition];
            let symbolNodeToInnerHtmlSymbol =  el("span",'',{className:"forecast-data"});
            symbolNodeToInnerHtmlSymbol.innerHTML = `${forecast.low}${symbols.Degrees}/${forecast.high}${symbols.Degrees}`

            const result = el("div",[el("span",[
                symbolNodeToInnerHtml,
                symbolNodeToInnerHtmlSymbol,
                el("span",forecast.condition,{className:"forecast-data"}),

            ],{className:'upcoming'})],{className:'forecast-info'})

            return result;
        }

        let finalRendeUpcomingElements = [];
        upcoming.forecast.forEach(x=>finalRendeUpcomingElements.push(renderUpcoming(x)));
        finalRendeUpcomingElements.forEach(x=>elements.upcoming().appendChild(x));

    }
})








