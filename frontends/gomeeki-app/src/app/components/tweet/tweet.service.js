export class TweetService {

    constructor ($http) {
        "ngInject";
        this.http = $http;
    }

    getTweets (city, lat, lng) {

        return this.http({
            method: 'GET',
            url: '/api/tweets?city=' + city + '&latitude=' + lat + '&longitude=' + lng
        }).then(function (response) {
            let tweets = [];
            angular.forEach(response.data, function (value, key) {
                tweets.push({
                    id: key,
                    coords: {
                        // latitude: value.latitude,
                        // longitude: value.longitude
                        latitude: value.longitude,
                        longitude: value.latitude

                    },
                    icon: value.user,
                    title: "Tweet:" + value.text + "<br />When:" + new Date(value.created).toDateString()
                });
            });
            return tweets;
        });
    }
}
