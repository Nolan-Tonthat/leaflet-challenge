

//create variable for .geojson
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


function createMap(){

    
 //interpret the data
 d3.json(url).then(function(response) {
    
    console.log(response)
    //create inital Map as map
    let map = L.map("map").setView([37.3394, -121.8950],7); //initial view coordinates for San Jose, CA

    //create tileLayer for markers
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`})
    .addTo(map)
    
    //add circle markers to map
    L.geoJson(response,
        {
            onEachFeature:pointInfo,
            pointToLayer:createCircles
        })
    .addTo(map)

    //add info for tooltips
    function pointInfo(feature,layer)
    {
        let location = feature.properties.place
        let magnitude = feature.properties.mag
        let depth = feature.geometry.coordinates[2]
        let time = (new Date(feature.properties.time))
        layer.bindPopup(`<text><b>Location</b>: ${location}</text><br>
                         <text><b>Magnitude</b>: ${magnitude}</text><br>                 
                         <text><b>Depth</b>: ${depth}km</text><br>
                         <text><b>Time</b>: ${time}`)
    }

    //Chooses color for circles based on earthquake depth (green = shallow, red = deep)
    function getColor(Edepth)
    {
        if(Edepth > 90){
            return '#FF0D0D' //Red
        }
        else if(Edepth > 70){
            return '#FF4E11' //Orange
        }
        else if(Edepth > 50){
            return '#FF8E15' //Light Orange
        }
        else if(Edepth > 30){
            return '#FAB733' //Gold
        }
        else if(Edepth > 10){
            return '#ACB334' //Yellow-Green
        }
        else if(Edepth > -10){
            return '#69B34C' //Green
        }
        else{return 'A0FFED'} //Teal for points w/o depth.
    }

    //creates circles for each datapoint
    function createCircles(feature,latlon)
    {
        let magnitude = feature.properties.mag*10
        let depth = feature.geometry.coordinates[2]
        return L.circleMarker(latlon,
            {
                //size of circle based on magnitude
                radius:magnitude,

                //color of circle based on earthquake depth (green = shallow, red = deep)
                fillColor: getColor(depth),
                color: "#000",
                weight: 0.25,
                opacity: 1,
                fillOpacity: 1
            })
    }

   

 })
}

createMap();

//paste into CSS below
// .legend {
//     line-height: 20px;
//     color: #252525;
//   }
//   .legend i {
//     width: 20px;
//     height: 20px;
//     float: left;
//     margin-right: 8px;
//     opacity: 0.8;
//   }
