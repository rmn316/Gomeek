<?php

namespace AppBundle\Service;

use AppBundle\Entity\Location;
use AppBundle\Entity\Tweet;
use AppBundle\Repository\TweetRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\NoResultException;
use DateTime;

/**
 * Class TweetService
 *
 * Process tweets and store to the cache. If a request is available in the current cache use the cache.
 *
 * @package AppBundle\Service
 */
class TweetService
{
    /** @var EntityManager */
    private $entityManager;
    /** @var TweetRepository */
    private $tweetRepository;
    /** @var TweetAPIService */
    private $APIService;
    /** @var string */
    private $cacheLifeTime;

    /**
     * TweetService constructor.
     *
     * @param EntityManager $entityManager
     * @param TweetRepository $tweetRepository
     * @param TweetAPIService $APIService
     * @param $cacheLifeTime
     */
    public function __construct(
        EntityManager $entityManager,
        TweetRepository $tweetRepository,
        TweetAPIService $APIService,
        $cacheLifeTime
    ) {
        $this->tweetRepository = $tweetRepository;
        $this->APIService = $APIService;
        $this->entityManager = $entityManager;
        $this->cacheLifeTime = $cacheLifeTime;
    }

    /**
     * @param Location $location
     * @return string
     */
    public function fetchTweets(Location $location)
    {
        try {
            $tweet = $this->tweetRepository->findOneByLocationCached($location, new DateTime('-' . $this->cacheLifeTime));
            $result = json_decode($tweet->getData());
        } catch (NoResultException $e) {
            $result = $this->APIService->getTweetsBy($location);
            $this->cacheResults($location, $result);
        }
        return $result;
    }

    /**
     * @param Location $location
     * @param array $results
     * @return Tweet
     */
    private function cacheResults(Location $location, array $results)
    {
        $tweets = new Tweet();
        $tweets->setLocation($location);
        $tweets->setData(json_encode($results));
        $tweets->setCreated(new DateTime());

        $this->entityManager->persist($tweets);
        $this->entityManager->flush($tweets);

        return $tweets;
    }
}