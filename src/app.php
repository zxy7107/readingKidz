<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/db-connect.php';

use Silex\Application;
use Silex\Provider\TwigServiceProvider;
use Symfony\Component\HttpFoundation\Request;

// Setup the application
$app = new Application();
// $app['debug'] = true;

$app->register(new TwigServiceProvider, array(
    'twig.path' => __DIR__ . '/templates',
));

// Setup the database
$app['db.table'] = DB_TABLE;
$app['db.dsn'] = 'mysql:dbname=' . DB_NAME . ';host=' . DB_HOST;
$app['db'] = $app->share(function ($app) {
    return new PDO($app['db.dsn'], DB_USER, DB_PASSWORD);
});

// Handle the index page
$app->match('/', function () use ($app) {
    //$query = $app['db']->prepare("SELECT message, author FROM {$app['db.table']}");
    $query = $app['db']->prepare("SELECT * FROM {$app['db.table']}");
    $thoughts = $query->execute() ? $query->fetchAll(PDO::FETCH_ASSOC) : array();

    return $app['twig']->render('index.twig', array(
        'title'    => 'Your Thoughts',
        'thoughts' => $thoughts,
    ));
});

// Handle the add page
$app->match('/add', function (Request $request) use ($app) {
    // $alert = null;
    $alert = array('type' => 'success', 'message' => 'Thank you for sharing your thought.');
    // If the form was submitted, process the input
    if ('POST' == $request->getMethod()) {
        try {
            // Make sure the photo was uploaded without error
            $message = $request->request->get('thoughtMessage');
            $author = $request->request->get('thoughtAuthor');
            $bookname = $request->request->get('bookname');
            $publisher = $request->request->get('publisher');
            $publication_date = $request->request->get('publication_date');
            $price = $request->request->get('price');
            $series = $request->request->get('series');
            $language = $request->request->get('language');
            $users = $request->request->get('users');
            // if ($message && $author && strlen($author) < 64) {
                // Save the thought record to the database
                $sql = "INSERT INTO {$app['db.table']} (message, author, bookname, publisher, publication_date, price, series, language, users) VALUES (:message, :author, :bookname, :publisher, :publication_date, :price, :series, :language, :users)";
                $query = $app['db']->prepare($sql);
                $data = array(
                    ':message' => $message,
                    ':author'  => $author,
                    ':bookname'  => $bookname,
                    ':publisher'  => $publisher,
                    ':publication_date'  => $publication_date,
                    ':price'  => $price,
                    ':series'  => $series,
                    ':language'  => $language,
                    ':users'  => $users
                );
                if (!$query->execute($data)) {
                    throw new \RuntimeException('Saving your thought to the database failed.');
                }
            // } else {
            //     throw new \InvalidArgumentException('Sorry, The format of your thought was not valid.');
            // }

            // Display a success message
            $alert = array('type' => 'success', 'message' => 'Thank you for sharing your thought.');
        } catch (Exception $e) {
            // Display an error message
            $alert = array('type' => 'error', 'message' => $e->getMessage());
        }
    }

    return $app['twig']->render('add.twig', array(
        'title' => 'Share Your Thought!',
        'alert' => $alert,
    ));
});

$list = array(
 '00001'=> array(
    'name' => 'Peter Jackson',
    'description' => 'Producer | Director',
    'image' => 'MV5BMTY1MzQ3NjA2OV5BMl5BanBnXkFtZTcwNTExOTA5OA@@._V1_SY317_CR8,0,214,317_AL_.jpg',
 ),
 '00002' => array(
    'name' => 'Evangeline Lilly',
    'description' => 'Actress',
    'image' => 'MV5BMjEwOTA1MTcxOF5BMl5BanBnXkFtZTcwMDQyMjU5MQ@@._V1_SY317_CR24,0,214,317_AL_.jpg',
 ),
);

$app->post('/punch', function (Request $request) use ($app) {
    $query = $app['db']->prepare("SELECT * FROM {$app['db.table']}");
    $thoughts = $query->execute() ? $query->fetchAll(PDO::FETCH_ASSOC) : array();
    // var_dump($thoughts);
    // var_dump(json_encode($thoughts['1']));
    // If the form was submitted, process the input
    // if ('POST' == $request->getMethod()) {
    //     try {
    //         // Make sure the photo was uploaded without error
    //         $message = $request->request->get('thoughtMessage');
    //         $author = $request->request->get('thoughtAuthor');

    //         // if ($message && $author && strlen($author) < 64) {
    //             // Save the thought record to the database
    //             $sql = "INSERT INTO {$app['db.table']} (message, author) VALUES (:message, :author)";
    //             $query = $app['db']->prepare($sql);
    //             $data = array(
    //                 ':message' => $message,
    //                 ':author'  => $author
                    
    //             );
    //             if (!$query->execute($data)) {
    //                 throw new \RuntimeException('Saving your thought to the database failed.');
    //             }
    //         // } else {
    //         //     throw new \InvalidArgumentException('Sorry, The format of your thought was not valid.');
    //         // }

    //         // Display a success message
    //         $alert = array('type' => 'success', 'message' => 'Thank you for sharing your thought.');
    //     } catch (Exception $e) {
    //         // Display an error message
    //         $alert = array('type' => 'error', 'message' => $e->getMessage());
    //     }
    // }


// $test = array();
// foreach ($thoughts as $value ) {
//     // var_export(json_encode($value));
//     array_push($test, json_encode($value));
// } 

// return json_encode(array(
//     'res' => $test
//     ));


// header('Content-type: text/json;charset=utf-8');


$payload = [];
 
foreach ($thoughts as $msg){
       $payload[$msg->id] =
       [
               'message' => $msg->message,
               'author' => $msg->author,
               'bookname' => $msg->bookname,
               'publisher' => $msg->publisher,
               'publication_date' => $msg->publication_date,
               'price' => $msg->price,
               'series' => $msg->series,
               'language' => $msg->language,
               'users' => $msg->users,
       ];
}
 
 return json_encode($payload, JSON_UNESCAPED_SLASHES);



});



$app->get('/', function() use ($list) {

 return json_encode($list);
});

$app->get('/{id}', function (Silex\Application $app, $id) use ($list) {

 if (!isset($list[$id])) {
     $app->abort(404, "id {$id} does not exist.");
 }
 return json_encode($list[$id]);
});


$app->run();
