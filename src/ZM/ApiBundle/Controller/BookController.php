<?php
 
/**
 * 联系人控制器
 */
namespace ZM\ApiBundle\Controller;
//引用写好的上传图片方法uploadPic的Controller，并命名为BaseController
use ZM\AdminBundle\Controller\DefaultController AS BaseController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
//继承BaseController
class BookController extends BaseController {
 
    /**
     * 上传Bookcover书封面
     *
     * @return Response
     */
    public function uploadBookcoverAction($app) {

        try {
            $request = Request::createFromGlobals()->request;
            $bookname = $request->get('user_id');
      
            $query1 = $app['db']->prepare("SELECT id FROM {$app['db.table']} WHERE bookname='{$bookname}'");
            // $book = $query1->execute() ? $query1->fetchAll(PDO::FETCH_ASSOC) : array();
            $book = $query1->execute() ? $query1->fetchAll() : array();
            if (isset($book[0]['id'])) {
                // Save the thought record to the database


                //判断是否有文件上传
                if (isset($_FILES['bookcover']) && $_FILES['bookcover'] != '') {
         
      
                    // //判断用户是否存在
                    // if(!empty($data['id'])) {
         
                        //设置图片保存路径
                        $path = 'image/bookcover/';
                        //获取上传文件后返回的文件名和扩展名
                        $file_name = $this->uploadPic($bookname, 'bookcover', $path);
                    //     //修改用户contact表bookcover头像字段的值
                    //     $conn->executeUpdate("UPDATE contact SET bookcover = ? WHERE id = ?", array($path . $file_name, $bookname));

                        $sql = "UPDATE {$app['db.table']} SET bookcover= (:bookcover) WHERE bookname= (:bookname)";

                        $query = $app['db']->prepare($sql);
                        $data = array(
                            ':bookcover' => $path.$file_name,
                            ':bookname' => $bookname
                        );
                        if (!$query->execute($data)) {
                            $result['flag'] = 9;
                            $result['content'] = 'Saving your thought to the database failed.';
                    
                        }


                        $result['file_name'] = $file_name;
                        $result['flag'] = 1;
                        $result['content'] = '上传头像成功！';
                    // } else {
                    //     $result['flag'] = 3;
                    //     $result['content'] = '用户不存在！';
                    // }
                }else{
                    $result['flag'] = 2;
                    $result['content'] = '上传失败，没有选择图片！';
                }

                   
            } else {
                $result['flag'] = 9;
                $result['content'] = '没有这个书名';
            }

        } catch (Exception $e) {
                $result['flag'] = 9;
                $result['content'] = '错误啦';
        }
        return new Response(json_encode($result), '200', array('Content-Type' => 'application/json'));
    }
}