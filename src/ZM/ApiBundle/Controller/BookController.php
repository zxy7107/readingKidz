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

    public function uploadImageCurl(){
           

            // Connecting to website.
            $ch = curl_init();
            // curl_setopt($ch, CURLOPT_URL, 'http://tutorials-hpdnn-env.us-east-2.elasticbeanstalk.com/api/uploadImageAction');
            curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:8099/api/uploadImageAction');
            $post = array(
                'bookcover' => new \CurlFile($_FILES["bookcover"]["tmp_name"], $_FILES["bookcover"]["type"], $_FILES["bookcover"]["name"])
                );
            $post = array_merge($post, $_POST);
 
            // Prepare the cURL call to upload the external script
            curl_setopt($ch, CURLOPT_HEADER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            // curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0");
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post);


            $return = curl_exec($ch);
            if (curl_errno($ch)) {

                $msg = curl_error($ch);
            }
            else {

                $msg = 'File uploaded successfully.';
            }

            curl_close($ch);
            return array_merge(json_decode($return, true), array('msg' => $msg));

    }

    /**
     * 上传Bookcover书封面
     *
     * @return Response
     */
    public function uploadBookcoverAction($app) {

        try {
            $request = Request::createFromGlobals()->request;
            $bookname = $request->get('user_id');
            $folder = $request->get('folder');
      
            $query1 = $app['db']->prepare("SELECT id FROM {$app['db.table']} WHERE bookname='{$bookname}'");
            // $book = $query1->execute() ? $query1->fetchAll(PDO::FETCH_ASSOC) : array();
            $book = $query1->execute() ? $query1->fetchAll() : array();
            if (isset($book[0]['id'])) {

                $result = $this->uploadImageCurl($folder);
         
                $sql = "UPDATE {$app['db.table']} SET bookcover= (:bookcover) WHERE bookname= (:bookname)";
                $query = $app['db']->prepare($sql);
                $data = array(
                    ':bookcover' => $result["image_url"],
                    ':bookname' => $bookname
                );
                if (!$query->execute($data)) {
                    $result['flag'] = 9;
                    $result['content'] = 'Saving your thought to the database failed.';
            
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

    /**
     * 上传Bookcover书封面
     *
     * @return Response
     */
    public function uploadImageAction($app) {

        try {
            $request = Request::createFromGlobals()->request;
            $folder = $request->get('folder');

             if(!isset($folder) || is_null($folder)) {
                $folder = 'bookcover';
            }

            //判断是否有文件上传
            if (isset($_FILES['bookcover']) && $_FILES['bookcover'] != '') {
     
                //设置图片保存路径
                $path = 'image/'.$folder.'/';
                //获取上传文件后返回的文件名和扩展名
                $file_name = $this->uploadPic(time(), 'bookcover', $path);

                $result['image_url'] = $path.$file_name;
                $result['file_name'] = $file_name;
                $result['flag'] = 1;
                $result['content'] = '上传图片成功！';

            }else{
                $result['flag'] = 2;
                $result['content'] = '上传失败，没有选择图片！';
            }
                   
        } catch (Exception $e) {
                $result['flag'] = 9;
                $result['content'] = '错误啦';
        }
        return new Response(json_encode($result), '200', array('Content-Type' => 'application/json'));
    }
}