/**
 * Created by Oshevchuk on 03.05.2017.
 */

var x = document.getElementById('demo');
function getLocation() {
    if (navigator.geolocation) {
        // navigator.geolocation.watchPosition(showPosition);
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        x.innerHTML = "not support";
    }
}

function showPosition(position) {
    x.innerHTML = "Lat: " + position.coords.latitude + "<br> Longitude: " + position.coords.longitude;

    // zoom--;
    pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    showInfo(pos, zoom);

}
var pos;
// var position = new google.maps.LatLng(41.850, -87.650);
var position = new google.maps.LatLng(48.643315, 23.282714);
var tile_size = 256;
// var tileCoordinate;
var zoom=14;

function initMap() {
    console.log('ok');
    showInfo(position, 14);
}

function showInfo(pos, zoom) {
    var scale = 1 << zoom;
    var worldCoordinates = projection(pos);
    console.log(worldCoordinates);

    var pixelCoordinates = new google.maps.Point(
        Math.floor(worldCoordinates.x * scale),
        Math.floor(worldCoordinates.y * scale)
    );
    console.log(pixelCoordinates);

    var tileCoordinate = new google.maps.Point(
        Math.floor(worldCoordinates.x * scale / tile_size),
        Math.floor(worldCoordinates.y * scale / tile_size)
    );
    console.log(tileCoordinate);
    buildMap(tileCoordinate);
}

function projection(lat) {
    var siny = Math.sin(lat.lat() * Math.PI / 180);
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);
    return new google.maps.Point(
        tile_size * (0.5 + lat.lng() / 360),
        tile_size * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
    );
}

function buildMap(tileCoordinate) {
    var startpos_x = tileCoordinate.x;
    var startpos_y = tileCoordinate.y;

    $('#map').empty();
    for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 5; x++) {
            $('#map').append('<img class="tile" data-x="'+x+'" data-y="'+y+'" src="https://tile.thunderforest.com/cycle/'+zoom+'/' + (startpos_x + x - 2) + '/' + (startpos_y + y - 2) + '.png?apikey=cd57107f8fe94339a18a22ff9f4a1ebf"/> ');

            if(y==2 && x==2){

            }
        }
        $('#map').append('<br><div class="col-md-12"></div>');
    }
    // $('#map').append('<img src="https://tile.thunderforest.com/cycle/14/9251/5651.png?apikey=cd57107f8fe94339a18a22ff9f4a1ebf"/>');
    // $('#map').append('<p>' + tileCoordinate + '</p>');
    $('.tile').click(function (e) {
        var parentOffset = $(this).parent().offset();
        //or $(this).offset(); if you really just want the current element's offset
        // var relX = e.pageX - parentOffset.left;
        // var relY = e.pageY - parentOffset.top;

        var cl_x= e.clientX-$(this).data('x')*256;
        var cl_y=e.clientY-$(this).data('y')*256;
        // $(this).data('y')
        console.log(cl_x, cl_y);

        console.log(tile2lat(cl_x, zoom));
    });
}

$(document).ready(function (e) {
    initMap();

});



function refresh(){
    var position = new google.maps.LatLng($('#lat').val(), $('#lon').val());
    showInfo(position, 14);
}

function zoomin() {
    zoom++;
    var position = new google.maps.LatLng($('#lat').val(), $('#lon').val());
    showInfo(position, zoom);
}
function zoomout() {
    zoom--;
    var position = new google.maps.LatLng($('#lat').val(), $('#lon').val());
    showInfo(position, zoom);
}

function tile2long(x, y) {
    return (x/Math.pow(2,z)*360-180);
}

function tile2lat(y, z) {
    var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
    return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}