<?php
namespace Iso\Controller;
use Silex\Application;
class ItemController
{
    public function indexAction(Request $request, Application $app)
    {
           echo "it works";
    }
}