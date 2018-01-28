<?php
 
/**
 * 联系人控制器
 */
namespace ZM\ApiBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class SaveNewBookController extends Controller {
 
    /**
     * 上传Bookcover书封面
     *
     * @return Response
     */
    public function saveNewBookAction($app) {

        try {
            $request = Request::createFromGlobals()->request;

            $bookname = $request->get('bookname');
            $author = $request->get('author');
            $language = $request->get('language');
            $price = $request->get('price');
            $publicationDate = $request->get('publicationDate');
            $publisher = $request->get('publisher');
            $purchaseDate = $request->get('purchaseDate');
            $series = $request->get('series');
            $users = $request->get('users');
      

            // $query1 = $app['db']->prepare("SELECT id FROM {$app['db.table']} WHERE bookname='{$bookname}'");
            // $book = $query1->execute() ? $query1->fetchAll() : array();
            
            if (isset($bookname)) {


            //     //判断是否有文件上传
            //     if (isset($_FILES['bookcover']) && $_FILES['bookcover'] != '') {
         
      
            //         // //判断用户是否存在
            //         // if(!empty($data['id'])) {
         
            //             //设置图片保存路径
            //             $path = 'image/bookcover/';
            //             //获取上传文件后返回的文件名和扩展名
            //             $file_name = $this->uploadPic($bookname, 'bookcover', $path);
            //         //     //修改用户contact表bookcover头像字段的值
            //         //     $conn->executeUpdate("UPDATE contact SET bookcover = ? WHERE id = ?", array($path . $file_name, $bookname));

                        $sql = "INSERT INTO {$app['db.table']} (bookname, author, language, price, publication_date, publisher, purchase_date, series, users) VALUES (:bookname, :author, :language, :price, :publicationDate, :publisher, :purchaseDate, :series, :users)";

                        $query = $app['db']->prepare($sql);
                        $data = array(
                            ':bookname' => $bookname,
                            ':author' => $author,
                            ':language' => $language,
                            ':price' => $price,
                            ':publicationDate' => $publicationDate,
                            ':publisher' => $publisher,
                            ':purchaseDate' => $purchaseDate,
                            ':series' => $series,
                            ':users' => $users
                        );
                        if (!$query->execute($data)) {
                            $result['code'] = 9;
                            $result['resMessage'] = 'Saving your thought to the database failed.';
                    
                        }


                        $result['result'] = array(
                            'bookname' => $bookname,
                            'author' => $sql,
                            'language' => $language,
                            'price' => $price,
                            'publicationDate' => $publicationDate,
                            'publisher' => $publisher,
                            'purchaseDate' => $purchaseDate,
                            'series' => $series,
                            'users' => $users
                            );
                        $result['code'] = 1;
                        $result['resMessage'] = '保存new book 成功！';
            //         // } else {
            //         //     $result['code'] = 3;
            //         //     $result['resMessage'] = '用户不存在！';
            //         // }
            //     }else{
            //         $result['code'] = 2;
            //         $result['resMessage'] = '上传失败，没有选择图片！';
            //     }

                   
            } else {
                $result['code'] = 9;
                $result['resMessage'] = '没有书名';
            }

        } catch (Exception $e) {
                $result['code'] = 9;
                $result['resMessage'] = '错误啦';
        }
        return new Response(json_encode($result), '200', array('resMessage-Type' => 'application/json'));
    }
}