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
class ContactController extends BaseController {
 
    /**
     * 用户上传头像
     *
     * @return Response
     */
    public function uploadHeadAction() {
 
        $request = Request::createFromGlobals()->request;
        $user_id = $request->get('user_id');
 
        //判断是否有文件上传
        if (isset($_FILES['head']) && $_FILES['head'] != '') {
 
            // $conn = $this->getDoctrine()->getConnection();
            // $data = $conn->fetchAssoc("SELECT id, head FROM contact WHERE id = ? LIMIT 1", array($user_id));
 
            // //判断用户是否存在
            // if(!empty($data['id'])) {
 
                //设置图片保存路径
                $path = 'image/head/';
                //获取上传文件后返回的文件名和扩展名
                $file_name = $this->uploadPic($user_id, 'head', $path);
            //     //修改用户contact表head头像字段的值
            //     $conn->executeUpdate("UPDATE contact SET head = ? WHERE id = ?", array($path . $file_name, $user_id));
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
 
        return new Response(json_encode($result), '200', array('Content-Type' => 'application/json'));
    }
}