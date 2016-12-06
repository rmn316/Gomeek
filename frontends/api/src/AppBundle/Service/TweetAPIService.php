<?php

namespace AppBundle\Service;

use AppBundle\Entity\Location;
use Endroid\Twitter\Twitter;

class TweetAPIService
{
    /** @var Twitter */
    private $twitter;
    /** @var integer */
    private $searchRadius;

    /**
     * TweetAPIService constructor.
     * @param Twitter $twitter
     * @param $searchRadius
     */
    public function __construct(Twitter $twitter, $searchRadius)
    {
        $this->twitter = $twitter;
        $this->searchRadius = $searchRadius;
    }

    /**
     * @param Location $location
     * @return array
     */
    public function getTweetsBy(Location $location)
    {
        $parameters = [
            'q' => $location->getName(),
            'geocode' => sprintf("%s,%s,50km", $location->getLatitude(), $location->getLongitude())
        ];
        $response = $this->twitter->query('search/tweets', 'GET', 'json', $parameters);

        return $this->parseResponse(json_decode($response->getContent(), true));
    }

    /**
     * @param array $response
     * @return array
     */
    private function parseResponse(array $response)
    {
        $tweets = [];
        foreach ($response['statuses'] as $item) {
            if ($this->isValid($item)) {
                $tweets[] = [
                    'text' => $item['text'],
                    'created' => (new \DateTime($item['created_at']))->format('Y-m-d H:i:s'),
                    'latitude' => $item['coordinates']['coordinates'][1],
                    'longitude' => $item['coordinates']['coordinates'][0],
                    'user' => $item['user']['profile_image_url']
                ];
            }
        }
        return $tweets;
    }

    /**
     * Ensure coordinates are available for the current tweet.
     *
     * @param array $item
     * @return bool
     */
    private function isValid($item) {
        if (isset($item['coordinates']) && $item['coordinates'] !== null) {
            return true;
        } else {
            return false;
        }
    }
}