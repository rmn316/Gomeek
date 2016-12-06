import {GeoCodeService} from './geocode.service';

export class GeoCodeServiceProvider {
    $get ($http) {
        'ngInject';
        return new GeoCodeService($http);
    }
}
