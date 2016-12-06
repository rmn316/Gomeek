import {TweetService} from './tweet.service';

export class TweetServiceProvider {
    $get ($http) {
        'ngInject';
        return new TweetService($http);
    }
}
