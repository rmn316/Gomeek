export class MainController {
    constructor(GeoCodeService, TweetService, $scope, $log, googleAPI) {
        "ngInject";
        this.geoCode = GeoCodeService;
        this.tweet = TweetService;
        this.log = $log;
        this.scope = $scope;
        this.previousSearch = [];
        this.current = 'Bangkok';
        this.data = {};

        this.scope.map = {};
        this.scope.markers = {};
        // doesn't work.
        this.scope.markersEvents = {
            click: function(marker, eventName, model) {
                console.log('Click marker');
                $scope.map.window.model = model;
                $scope.map.window.show = true;
            }
        };
        // dont know.
        this.scope.window = {
            marker: {},
            show: false,
            closeClick: function () {
                this.show = false;
            },
            options: {}
        };

        this.geoCode.getCoords(this.current).then(function(data) {
            this.scope.map = data.map;
            this.scope.markers[0] = data.marker;
            this.tweet.getTweets(this.current, data.map.center.latitude, data.map.center.longitude).then(function (response) {
                this.scope.markers = [];
                this.scope.markers = response;
            }.bind(this));
        }.bind(this));
    }

    search() {
        // check if previous as saves calling api again.
        let previous = this.previousSearch.filter(function (element) {
            return element.current == this.data.search;
        }.bind(this));

        if (previous.length > 0) {
            this.tweet.getTweets(previous.city, previous.latitude, previous.longitude).then(function (response) {
                this.current = previous.city;
                // remove from the previousSearch list. as now active search.
                this.previousSearch = this.previousSearch.filter(function (item) {
                    return item.city !== previous.city;
                });
                this.scope.map.center = {
                    latitude: previous.latitude,
                    longitude: previous.longitude
                };
                this.scope.markers = response;
                this.scope.previous = this.previousSearch;
            }.bind(this));
        } else {
            this.scope.map = {};
            this.scope.marker = {};
            this.geoCode.getCoords(this.data.search).then(function(data) {
                this.previousSearch.unshift(
                    {city: this.current, latitude: data.map.center.latitude, longitude: data.map.center.longitude}
                );
                this.scope.previous = this.previousSearch;
                this.current = this.data.search;
                this.data.search = null;
                this.scope.map = data.map;
                this.tweet.getTweets(this.current, data.coords.latitude, data.coords.longitude).then(function (response) {
                    this.scope.marker = response[0]
                }.bind(this));
            }.bind(this));
        }
    }

    history(previousCity, latitude, longitude) {
        // add current city to previous
        this.previousSearch.unshift({
            city: this.current,
            latitude: this.scope.map.center.latitude,
            longitude: this.scope.map.center.longitude
        });
        // remove previous from list
        this.previousSearch = this.previousSearch.filter(function (elem) {
            return elem.city !== previousCity;
        }.bind(this));
        // truncate ...
        this.previousSearch.slice(0, 5);

        this.tweet.getTweets(previousCity, latitude, longitude).then(function (response) {
            this.current = previousCity;
            this.scope.map.center = {
                latitude: previous.latitude,
                longitude: previous.longitude
            };
            this.scope.markers = response;
            this.scope.previous = this.previousSearch;
        });
    }
}
