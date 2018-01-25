<?php
namespace ZM\RouteBundle\Controller;

use Silex\Application;
use Silex\Api\ControllerProviderInterface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use ZM\ApiBundle\Controller\BookController AS BookController;

class ApiProvider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        // creates a new controller based on the default route
        $controllers = $app['controllers_factory'];

        // $controllers->get('/', function (Application $app) {
        //     // return $app->redirect('/hello');
        //     return $app->redirect('/punchview');
        // });

        $controllers->post('/uploadBookcoverAction', function (Application $app) {
            // return $app->redirect('/hello');

		        $c = new BookController();
		        return $c->uploadBookcoverAction($app);
        });

        return $controllers;
    }
}