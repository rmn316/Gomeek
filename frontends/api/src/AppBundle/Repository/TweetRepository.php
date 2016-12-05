<?php

namespace AppBundle\Repository;

use AppBundle\Entity\Location;
use AppBundle\Entity\Tweet;
use DateTime;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\Expr;

class TweetRepository extends EntityRepository
{
    /**
     * Fetch latest cached result stored in database
     *
     * @param Location $location
     * @param DateTime $createdSince
     * @return Tweet
     */
    public function findOneByLocationCached(Location $location, DateTime $createdSince)
    {
        $queryBuilder = $this->createQueryBuilder('t')
            ->join('t.location', 'l', Expr\Join::WITH, 't.location = l.id')
            ->where('l.latitude = :latitude AND l.longitude = :longitude AND t.created >= :datetime')
            ->orderBy('t.created', 'DESC')
            ->setParameter('latitude', $location->getLatitude())
            ->setParameter('longitude', $location->getLongitude())
            ->setParameter('datetime', $createdSince->format('Y-m-d H:i:s'))
            ->getQuery();
        return $queryBuilder->getSingleResult();
    }
}
