export class GeoCodeService {

    constructor ($http) {
        "ngInject";
        this.http = $http;
    }

    getCoords (city) {
        let cityEncoded = city.replace(/ /g, '+');
        return this.http({
            method: 'GET',
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + cityEncoded
        }).then (function (response) {
            let lat = response.data.results[0].geometry.location.lat,
                lng = response.data.results[0].geometry.location.lng;

            return {
                map: {
                    center: {
                        latitude: lat,
                        longitude: lng
                    }
                },
                marker: {
                    id: 0,
                    coords: {
                        latitude: lat,
                        longitude: lng
                    }
                }
            };
        });
    }
}