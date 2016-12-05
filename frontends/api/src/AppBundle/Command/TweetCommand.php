<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpFoundation\Request;

class TweetCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('tweets:test')
            ->setDescription('Tweet Test');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $tweetsService = $this->getContainer()->get('app_bundle.service.tweet');

        $request = new Request();
        $request->request->set('city', 'bangkok');
        $request->request->set('latitude', '13.7559984');
        $request->request->set('longitude', '100.50189269999998');

        $response = $tweetsService->getTweetBy($request);

        var_dump($response);
    }
}