<?php
 
/**
 * 联系人控制器
 */
namespace ZM\ApiBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use ZM\AdminBundle\Controller\DefaultController AS BaseController;
use ZM\ApiBundle\Controller\BookController AS BookController;

class UpdateActivityAction extends Controller {
 
    /**
     * 上传Bookcover书封面
     *
     * @return Response
     */
    public function updateActivityAction($app) {

        try {
            $request = Request::createFromGlobals()->request;

            $id = $request->get('id');
            $title = $request->get('title');
            $content = $request->get('content');
            $duration = $request->get('duration');
            $target = $request->get('target');
            $book_lidou = $request->get('book_lidou');
            $extension_activity = $request->get('extension_activity');
            $assessment = $request->get('assessment');


            // $query1 = $app['db']->prepare("SELECT id FROM {$app['db.table']} WHERE bookname='{$bookname}'");
            // $book = $query1->execute() ? $query1->fetchAll() : array();
      
                        $sql = "UPDATE {$app['db.table_activity']} SET title = (:title), content = (:content), duration = (:duration), target = (:target), book_lidou = (:book_lidou), extension_activity = (:extension_activity),assessment = (:assessment) WHERE id=(:id)";


                        $query = $app['db']->prepare($sql);
                        $data = array(
                            ':title' => $title,
                            ':content' => $content,
                            ':duration' => $duration,
                            ':target' => $target,
                            ':book_lidou' => $book_lidou,
                            ':extension_activity' => $extension_activity,
                            ':assessment' => $assessment,
                            ':id' => $id
                        );
                        if (!$query->execute($data)) {
                            $result['code'] = 9;
                            $result['resMessage'] = 'Saving your thought to the database failed.';
                    
                        } else {

                            $result['result'] = array(
                            'title' => $title,
                            'content' => $content,
                            'duration' => $duration,
                            'target' => $target,
                            'book_lidou' => $book_lidou,
                            'extension_activity' => $extension_activity,
                            'assessment' => $assessment,
                            'sql' => $sql,
                            'id' => $id
                            );


                            $result['code'] = 1;
                            $result['resMessage'] = '保存new activity 成功！';

                            //判断是否有文件上传
                            if (isset($_FILES['bookcover']) && $_FILES['bookcover'] != '') {
                                    $c = new BookController();
                                    $result =  $c->uploadImageCurl('activity');;
                                    
                                    $sql2 = "INSERT INTO {$app['db.table_activity_figure']} (activity_id, figure) VALUES (:activity_id, :figure)";

                                    $query = $app['db']->prepare($sql2);
                                    $data = array(
                                        ':figure' => $result["image_url"],
                                        ':activity_id' => $id
                                    );
                                    if (!$query->execute($data)) {
                                        $result['flag'] = 9;
                                        $result['content'] = 'Saving your thought to the database failed.';
                                    }

                                    $result['file_name'] = $result["file_name"];
                                    $result['result']['figure'] = $result["file_name"];
                                    $result['result']['sql2'] = $sql2;
                                    $result['flag'] = 1;
                                    $result['resMessage'] = '保存new activity 成功！ 上传图片成功！';
                              
                            }else{
                                $result['flag'] = 2;
                                $result['resMessage'] = '保存new activity 成功！ 上传失败，没有选择图片！';
                            }

                        }


        } catch (Exception $e) {
                $result['code'] = 9;
                $result['resMessage'] = '错误啦';
        }
        return new Response(json_encode($result), '200', array('resMessage-Type' => 'application/json'));
    }
}