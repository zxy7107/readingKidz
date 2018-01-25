<?php
 
/**
 * 编写uploadPic方法上传图片
 */
namespace ZM\AdminBundle\Controller;
 
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Filesystem\Filesystem;
 
class DefaultController extends Controller {
 
    public function indexAction($name) {
        return $this->render('ZMAdminBundle:Default:index.html.twig', array('name' => $name));
    }
 
    /**
     * 上传图片
     *
     * @param type $user_id 用户的id，用作文件名
     * @param type $str     表单中file类型的input的name
     * @param type $path    保存路径
     * @return type
     */
    public function uploadPic($user_id, $str, $path) {
 
        $fs = new Filesystem();
 
        //检查路径是否存在
        if (!$fs->exists($path)) {
            //如果不存在，创建目录
            $fs->mkdir($path, 0700);
        }
 
        //使用Upload库
        $storage = new \Upload\Storage\FileSystem($path);
        $file = new \Upload\File($str, $storage);
 
        //如果文件名为空
        if ($file->getName() != '') {
            //设置文件名为用户的id
            $file->setName($user_id);
 
            //验证文件上传
            $file->addValidations(array(
                //指定文件类型
                new \Upload\Validation\Mimetype(array('image/png', 'image/jpg', 'image/jpeg', 'image/gif')),
                //指定文件大小
                new \Upload\Validation\Size('2M')
            ));
 
            //上传文件
            try {
                //成功
                $file->upload();
                //文件名和扩展名
                $file_name = $file->getNameWithExtension();
            } catch (\Exception $e) {
                //失败!
                $errors = $file->getErrors();
            }
        }
 
        //返回文件名和扩展名
        return $file_name;
    }
 
}