<?php

namespace AppBundle\Service;

use AppBundle\Entity\Location;
use DateTime;
use Doctrine\ORM\EntityManager;

class LocationService
{
    /** @var EntityManager */
    private $entityManager;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function processLocation($city, $latitude, $longitude)
    {
        $repository = $this->entityManager->getRepository(Location::class);

        $location = $repository->findOneBy(['latitude' => $latitude, 'longitude' => $longitude]);
        if ($location === null) {
            $location = $this->createLocation($city, $latitude, $longitude);
        }

        return $location;
    }

    private function createLocation($city, $latitude, $longitude)
    {
        $location = new Location();
        $location->setName($city);
        $location->setLatitude($latitude);
        $location->setLongitude($longitude);
        $location->setCreated(new DateTime());

        $this->entityManager->persist($location);
        $this->entityManager->flush($location);

        return $location;
    }
}