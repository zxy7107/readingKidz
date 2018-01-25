<?php
namespace ZM\ApiBundle\Controller;

use Silex\Application;
use Silex\Api\ControllerProviderInterface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use ZM\ApiBundle\Controller\ContactController AS ContactController;

class HelloControllerProvider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        // creates a new controller based on the default route
        $controllers = $app['controllers_factory'];

        $controllers->get('/', function (Application $app) {
            // return $app->redirect('/hello');
            return $app->redirect('/punchview');
        });

        $controllers->post('/uploadHeadAction', function (Application $app) {
            // return $app->redirect('/hello');

		        $c = new ContactController();
		        return $c->uploadHeadAction();
        });

        return $controllers;
    }
}