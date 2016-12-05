<?php

namespace AppBundle\Controller;

use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function indexAction(Request $request)
    {
        $locationService = $this->get('app_bundle.service.location');
        $tweetService = $this->get('app_bundle.service.tweet');

        try {
            $location = $locationService->processLocation(
                $request->query->get('city'),
                $request->query->get('latitude'),
                $request->query->get('longitude')
            );

            $tweets = $tweetService->fetchTweets($location);
        } catch (Exception $e) {
            throw $e;
        }

        return new JsonResponse($tweets);
    }
}
