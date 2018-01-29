<?php
 
/**
 * 联系人控制器
 */
namespace ZM\ApiBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use ZM\AdminBundle\Controller\DefaultController AS BaseController;


class SaveNewActivityController extends Controller {
 
    /**
     * 上传Bookcover书封面
     *
     * @return Response
     */
    public function saveNewActivityAction($app) {

        try {
            $request = Request::createFromGlobals()->request;

            $title = $request->get('title');
            $place = $request->get('place');
            $type = $request->get('type');
            $subtype = $request->get('subtype');
            $content = $request->get('content');
            $duration = $request->get('duration');
            $target = $request->get('target');
            $book_lidou = $request->get('book_lidou');
            $extension_activity = $request->get('extension_activity');
            $assessment = $request->get('assessment');


            // $query1 = $app['db']->prepare("SELECT id FROM {$app['db.table']} WHERE bookname='{$bookname}'");
            // $book = $query1->execute() ? $query1->fetchAll() : array();
      
                        $sql = "INSERT INTO {$app['db.table_activity']} (title, place, type, subtype, content, duration, target, book_lidou, extension_activity, assessment) VALUES (:title, :place, :type, :subtype, :content, :duration, :target, :book_lidou, :extension_activity, :assessment)";

                        $query = $app['db']->prepare($sql);
                        $data = array(
                            ':title' => $title,
                            ':place' => $place,
                            ':type' => $type,
                            ':subtype' => $subtype,
                            ':content' => $content,
                            ':duration' => $duration,
                            ':target' => $target,
                            ':book_lidou' => $book_lidou,
                            ':extension_activity' => $extension_activity,
                            ':assessment' => $assessment
                        );
                        if (!$query->execute($data)) {
                            $result['code'] = 9;
                            $result['resMessage'] = 'Saving your thought to the database failed.';
                    
                        } else {
                            $id = $app['db']->lastInsertId();

                            $result['result'] = array(
                            'title' => $title,
                            'place' => $place,
                            'type' => $type,
                            'subtype' => $subtype,
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
                            if (isset($_FILES['figure']) && $_FILES['figure'] != '') {
                     
                  
                                    //设置图片保存路径
                                    $path = 'image/bookcover/';
                                    //获取上传文件后返回的文件名和扩展名
                                    $u = new BaseController();
                                    $file_name = $u->uploadPic($title.time(), 'figure', $path);

                                    $sql2 = "INSERT INTO {$app['db.table_activity_figure']} (activity_id, figure) VALUES (:activity_id, :figure)";


                                    $query = $app['db']->prepare($sql2);
                                    $data = array(
                                        ':figure' => $path.$file_name,
                                        ':activity_id' => $id
                                    );
                                    if (!$query->execute($data)) {
                                        $result['flag'] = 9;
                                        $result['content'] = 'Saving your thought to the database failed.';
                                
                                    }

                                    $result['file_name'] = $file_name;
                                    $result['result']['figure'] = $file_name;
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