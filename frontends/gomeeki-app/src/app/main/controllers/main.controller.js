export class MainController {
    constructor($http, $scope, $log, googleAPI) {
        "ngInject";
        this.http = $http;
        this.log = $log;
        this.scope = $scope;
        this.googleAPI = googleAPI; //googleAPI;
        this.city = 'Bangkok';
        this.getTweets(this.city, {latitude: 13.7563309, longitude: 100.5017651});
        this.previousSearch = [];
        this.tweets = [];
        this.data = {};
    }

    search() {
        // check if previous as saves calling api again.
        let previous = this.previousSearch.filter(function (element) {
            return element.city == this.data.search;
        }.bind(this));

        if (previous.length > 0) {
            this.getTweets(previous.city, {latitude: previous.latitude, longitude: previous.longitude});
            this.city = previous.city;
            // remove from the previousSearch list. as now active search.
            this.previousSearch = this.previousSearch.filter(function (item) {
                return item.city !== this.city
            }.bind(this));
        } else {
            this.getGeoLocationForCity(this.data.search);
        }
    }

    history(previousCity, latitude, longitude) {
        // add current city to previous
        this.previousSearch.unshift({
            city: this.city,
            latitude: this.geoLocation.latitude,
            longitude: this.geoLocation.longitude
        });
        // remove previous from list
        this.previousSearch = this.previousSearch.filter(function (elem) {
            return elem.city !== previousCity;
        }.bind(this));
        // truncate ...
        this.previousSearch.slice(0, 5);

        this.getTweets(previousCity, {latitude: latitude, longitude: longitude});
    }

    getGeoLocationForCity(name) {
        let geoLocation = {
            latitude : null,
            longitude : null
        },
            url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + name + "&components=locality&key=" + this.googleAPI;
        this.http.get(url).then(function (response) {
            // push the old one into the previous queue
            this.previousSearch.unshift({
                city: this.city,
                latitude: this.geoLocation.latitude,
                longitude: this.geoLocation.longitude
            });
            // trim the previous search and limit to 5
            this.previousSearch.slice(0, 5);

            this.city = name;
            geoLocation.longitude = response.data.results[0].geometry.location.lat;
            geoLocation.latitude = response.data.results[0].geometry.location.lng;
            this.getTweets(this.city, geoLocation);
        }.bind(this));
    }

    getTweets (city, geoLocation) {
        let url = '/api/tweets?city=' + city + '&latitude=' + geoLocation.latitude + '&longitude=' + geoLocation.longitude;
        this.http.get(url).then(function (response) {
            // process the tweets.
            this.log.info(response);
            this.tweets = [];
            angular.forEach(response.data, function (value) {
                this.tweets.push({
                    text: value.text,
                    created: value.created,
                    user: value.user,
                    latitude: value.latitude,
                    longitude: value.longitude
                });
            }.bind(this));
            this.geoLocation = geoLocation;
        }.bind(this));
    }
}
