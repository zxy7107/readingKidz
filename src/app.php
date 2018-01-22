<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/db-connect.php';

use Silex\Application;
use Silex\Provider\TwigServiceProvider;
use Symfony\Component\HttpFoundation\Request;

// Setup the application
$app = new Application();
$app['debug'] = true;

$app->register(new TwigServiceProvider, array(
    'twig.path' => __DIR__ . '/templates',
));

// Setup the database
$app['db.table'] = DB_TABLE;
$app['db.table_punch'] = DB_TABLE_PUNCH;
$app['db.dsn'] = 'mysql:dbname=' . DB_NAME . ';host=' . DB_HOST;
$app['db'] = $app->share(function ($app) {
    return new PDO($app['db.dsn'], DB_USER, DB_PASSWORD);
});

function array2object($array) {
  if (is_array($array)) {
    $obj = new StdClass();
    foreach ($array as $key => $val){
      $obj->$key = $val;
    }
  }
  else { $obj = $array; }
  return $obj;
}

function object2array($object) {
  if (is_object($object)) {
    foreach ($object as $key => $value) {
      $array[$key] = $value;
    }
  }
  else {
    $array = $object;
  }
  return $array;
}

// Handle the index page
$app->match('/', function () use ($app) {
    //$query = $app['db']->prepare("SELECT message, author FROM {$app['db.table']}");
    $query = $app['db']->prepare("SELECT * FROM {$app['db.table']}");
    $thoughts = $query->execute() ? $query->fetchAll(PDO::FETCH_ASSOC) : array();

    return $app['twig']->render('index.twig', array(
        'title'    => 'Your Thoughts',
        'thoughts' => $thoughts,
        'alert' => '',
        'tab' => 'index'
    ));
});
$app->match('/index_original', function () use ($app) {
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

// Handle the add page
$app->match('/punchview', function (Request $request) use ($app) {
    

    return $app['twig']->render('punch.twig', array(
        'title' => 'Share Your Thought!',
        'alert' => '',
        'tab' => 'punch'
    ));
});


$app->match('/punch', function (Request $request) use ($app) {
    // If the form was submitted, process the input
    if ('POST' == $request->getMethod()) {
        try {
            // Make sure the photo was uploaded without error
            $bookname = $request->request->get('searchWords');
            
            $query1 = $app['db']->prepare("SELECT id FROM {$app['db.table']} WHERE bookname='{$bookname}'");
            $book = $query1->execute() ? $query1->fetchAll(PDO::FETCH_ASSOC) : array();
            if ($bookname) {
                // Save the thought record to the database

                $sql = "INSERT INTO {$app['db.table_punch']} (book_id) VALUES (:book_id)";
                $query = $app['db']->prepare($sql);
                $data = array(
                    ':book_id' => $book[0]['id']
                );
                
                if (!$query->execute($data)) {
                    $res = array(
                     'result'=> array(
                     ),
                     'code'=> '001',
                     'resultMassage' => 'Saving your thought to the database failed.',
                     'success' => false
                    );
                    return json_encode($res, JSON_UNESCAPED_SLASHES);  
                }

                $res = array(
                 'result'=> array(
                    'book_id' => $book[0]['id'],
                    'book_name' => $bookname
                 ),
                 'code'=> '001',
                 'resultMassage' => '打卡成功啦',
                 'success' => true
                );
                return json_encode($res, JSON_UNESCAPED_SLASHES);    
            } else {
                $res = array(
                 'result'=> array(
                 ),
                 'code'=> '001',
                 'resultMassage' => '没有bookname',
                 'success' => false
                );
                return json_encode($res, JSON_UNESCAPED_SLASHES);  
            }

        } catch (Exception $e) {
                $res = array(
                 'result'=> array(
                 ),
                 'code'=> '001',
                 'resultMassage' => '错误啦',
                 'success' => false
                );
                return json_encode($res, JSON_UNESCAPED_SLASHES);  
        }
    }

    
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



$app->post('/getBookList', function (Request $request) use ($app) {
    $query = $app['db']->prepare("SELECT * FROM {$app['db.table']}");
    $thoughts = $query->execute() ? $query->fetchAll(PDO::FETCH_ASSOC) : array();

    $payload = array();

    foreach ($thoughts as $key => $msg_ori){
            $msg = array2object($msg_ori);
            $payload[$key] =  array
           (
                   'message' => $msg->message,
                   'author' => $msg->author,
                   'bookname' => $msg->bookname,
                   'publisher' => $msg->publisher,
                   'publicationDate' => $msg->publication_date,
                   'price' => $msg->price,
                   'series' => $msg->series,
                   'language' => $msg->language,
                   'users' => $msg->users,
           );

    }
    // var_export($payload);
    // sort($payload);  
    // $res = json_encode($payload, JSON_UNESCAPED_SLASHES);  
    $res = json_encode($payload, true);  
    return $res;
});

$app->post('/getPunchList', function (Request $request) use ($app) {


    $query = $app['db']->prepare("SELECT punch_createtime, {$app['db.table']}.bookname as bookname FROM {$app['db.table_punch']} LEFT JOIN {$app['db.table']} ON {$app['db.table_punch']}.book_id={$app['db.table']}.id");
    $thoughts = $query->execute() ? $query->fetchAll(PDO::FETCH_ASSOC) : array();

    $punchlist = array();

    foreach ($thoughts as $key => $punch_ori){
            $punch = array2object($punch_ori);
            $punchlist[$key] =  array
           (
                   'punchDatetime' => $punch->punch_createtime,
                   'bookname' => $punch->bookname
           );

    }
    // sort($punchlist);  
    $res = json_encode($punchlist, JSON_UNESCAPED_SLASHES);  
    return $res;
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
