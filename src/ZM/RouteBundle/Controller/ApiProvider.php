<?php
namespace ZM\RouteBundle\Controller;

use Silex\Application;
use Silex\Api\ControllerProviderInterface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use ZM\ApiBundle\Controller\BookController AS BookController;
use ZM\ApiBundle\Controller\SaveNewBookController AS SaveNewBookController;
use ZM\ApiBundle\Controller\SaveNewActivityController AS SaveNewActivityController;
use ZM\ApiBundle\Controller\UpdateActivityAction AS UpdateActivityAction;

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

        $controllers->post('/saveNewBookAction', function (Application $app) {
            // return $app->redirect('/hello');

                $c = new SaveNewBookController();
                return $c->saveNewBookAction($app);
        });
        $controllers->post('/saveNewActivityAction', function (Application $app) {
            // return $app->redirect('/hello');

                $c = new SaveNewActivityController();
                return $c->saveNewActivityAction($app);
        });
        $controllers->post('/updateActivityAction', function (Application $app) {
            // return $app->redirect('/hello');

		        $c = new UpdateActivityAction();
		        return $c->updateActivityAction($app);
        });

        return $controllers;
    }
}