# Elastic Beanstalk + PHP Demo App - "Share Your Thoughts"

This demo app shows you how to run a simple PHP application on AWS Elastic Beanstalk.

## Run the App
Follow the steps below to deploy the demo application to an Elastic Beanstalk PHP environment. Accept the default settings unless indicated otherwise in the steps below:

1. Download the ZIP file from the [Releases section](https://github.com/awslabs/eb-demo-php-simple-app/releases) of this repository.
2. Login to the [Elastic Beanstalk Management Console](https://console.aws.amazon.com/elasticbeanstalk)
3. Click `Create New Application` and give your app a name and description
4. Choose 'PHP' in the 'Predefined configuration' dropdown and click `Next`
5. Upload the ZIP file downloaded in Step 1
6. Choose 'Create an RDS DB Instance with this environment' in the 'Additional Resources' step
7. Allocate 5GB of storage and provide a username and password for your database
8. Review and launch the application
-------------------------------------------------------------------------------------
readingKidz 
http://readingkid.us-east-2.elasticbeanstalk.com/

imageserver-v1.0.5
公共接口：上传图片

v1.1.6 
1.fix issue: book_lidou选择

v1.1.5
1. fix issue: 按下载状态搜索

v1.1.4
1.导入youku活动记录
2.更新或新增活动后清空input file
3.显示搜索的记录条数
4.library页模板改造


v1.1.3
1. fix issue: activity展示时 book_lidou和target显示及更新错误

v1.1.2
1. 学习目标可选

v1.1.1
1. 更新活动(含上传图片)

v1.1.0
1. 新增活动功能(含上传图片)
2. 按tab 展示 books & activities

v1.0.5
1. book library模糊匹配改用jQuery Typeahead.js


v1.0.4
1. 新增 上传bookcover图片


v1.0.3
1. 新增 “最近打卡的书”
2. 新增 按阅读次数打卡
3. 新增 按日打卡量展示年历统计，并优化配色

v1.0.2
1.增加loading&alert

v1.0.1
1.更新api地址http://readingkid.us-east-2.elasticbeanstalk.com/ 

v1.0.0  
1. 阅读打卡操作
2. 按年历展示阅读打卡记录


-------------------------------------------------------------------------------------
mac环境：
sudo apachectl start
sudo apachectl restart
sudo apachectl stop

apache配置文件：/private/etc/apache2/httpd.conf

http://127.0.0.1:8099/

-------------------------------------------------------------------------------------
http://readingkid.us-east-2.elasticbeanstalk.com/punchview
http://127.0.0.1:8099/
http://10.32.80.152:8099/


cd D:/Users/zhangxy/Documents/Learning/www/Apache24/bin
httpd -k restart -n "ApacheServer"

D:\Users\zhangxy\Documents\Learning\www\Apache24\conf\httpd.conf
DocumentRoot "D:/Users/zhangxy/Documents/Learning/www/Apache24/htdocs/readingKidz/web"
<Directory "D:/Users/zhangxy/Documents/Learning/www/Apache24/htdocs/readingKidz/web">

#php5 新增
LoadModule php5_module "D:/Users/zhangxy/Documents/Learning/www/php5/php5apache2_4.dll"
AddType application/x-httpd-php .php .html .htm .php5
PHPIniDir "D:/Users/zhangxy/Documents/Learning/www/php5"


composer -V
composer create-project topthink/think mixmatch-tp5 --prefer-dist
composer.json 配置文件


要解决和下载依赖，请执行 install 命令：

php composer.phar install
如果你进行了全局安装，并且没有 phar 文件在当前目录，请使用下面的命令代替：

composer install


D:/Users/zhangxy/Documents/Learning/www/Apache24/htdocs/readingKidz/web

-------------------------------------------------------------------------------------
Apache/Nginx为PHP设置、添加$_SERVER服务器环境变量
https://segmentfault.com/a/1190000004634251

SetEnv 变量名 变量值

-------------------------------------------------------------------------------------
Using Elastic Beanstalk with Amazon Relational Database Service
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.RDS.html?icmpid=docs_elasticbeanstalk_console

.htaccess
<IfModule mod_env.c>  
SetEnv RDS_DB_NAME xxx
SetEnv RDS_USERNAME  xxx
SetEnv RDS_PASSWORD  xxx
SetEnv RDS_HOSTNAME xxxx
</IfModule>  
-------------------------------------------------------------------------------------
mysql workbench


-------------------------------------------------------------------------------------



-------------------------------------------------------------------------------------

`activity_cycle` tinyint(4) DEFAULT NULL COMMENT '活动周期'
`count_down` tinyint(4) DEFAULT NULL COMMENT '倒计时'
`promotion_id_encryption` varchar(50) DEFAULT NULL COMMENT '策略id加密'
`coupon_name` varchar(100) DEFAULT NULL COMMENT '优惠券名称'
`product_level` tinyint(4) DEFAULT NULL COMMENT '产品等级'
KEY `ix_01_activity_id` (`activity_id`)
`cancel_date` datetime DEFAULT NULL COMMENT '卡注销时间'
`status` varchar(10) DEFAULT NULL COMMENT '卡状态 0.未激活 1.已激活 2.已注销'


colname	coltype	comment	Not Null	index
product_id	varchar(50)	商品Id primary key	Y default ''	
promotion_id	int(11)	优惠券id	Y default 0	联系索引
product_line_id	int(11)	产线id	Y default 0	
product_type	char(4)	商品类型0001-优惠券,其他-0000	Y default '0000'	
product_img_url	varchar(200)	商品图片	Y default ''	
product_title	varchar(50)	商品标题	Y default ''	
product_subtile	varchar(200)	商品副标题	Y default ''	
product_price	bigint	商品价格	Y default 0	
product_price_discount	int	折扣0到100	Y default 0	
product_price_type	char(4)	商品价格种类0001表示人民币，0002表示积分，其他-0000	Y default '0000'
product_jump_url	varchar(200)	商品跳链	Y default ''	
is_deleted	bit(1)	0：否  1：是	Y default 0	
weight	int	权重	Y default 0	
detail	varchar(2000)	商品消息描述。特有属性json格式描述	Y default ''	
datachange_createtime	datetime	DEFAULT CURRENT_TIMESTAMP(3)	Y CURRENT_TIMESTAMP(3)	
datachange_lasttime	datetime	DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)	Y CURRENT_TIMESTAMP(3)	



--------------------------------------------------------------------------------------------------------
In your CREATE TABLE you can declare a column like this:

  `mydtcol` DATETIME DEFAULT CURRENT_TIMESTAMP 
Before 5.6, it's not possible to use CURRENT_TIMESTAMP for a DATETIME column. It is possible with the first TIMESTAMP column in a table.

  `mytscol` TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
-----------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS `t_books`;


CREATE TABLE 
  `awsdatabase`.`t_books` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'book id',   
  `bookname` VARCHAR(45) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '书名',   
  `message` VARCHAR(45) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',   
  `publisher` VARCHAR(45) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',   
  `publication_date` DATE ,   
  `edition` VARCHAR(45) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',   
  `purchase_date` DATE ,   
  `price` FLOAT NOT NULL DEFAULT 0,   
  `series` CHAR(4) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',   
  `author` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',   
  `language` VARCHAR(45) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',  
  `users` VARCHAR(45) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',  
  `datachange_createtime` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,   
  `datachange_lasttime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `awsdatabase`.`t_books` CHARACTER SET = utf8 , COLLATE = utf8_bin;


INSERT INTO `t_books` VALUES ('1', '书名', '出版社', '2017-1-1', '第1版', '2018-2-31', '56.33','系列书籍','作者', '语言', 'zxy', '2017-10-25 20:58:19', '2017-10-25 20:58:19');

INSERT INTO `t_books` (`bookname`, `publisher`, `publication_date`, `edition`, `purchase_date`, `price`, `series`, `author`, `language`, `users`) VALUES
(`bookname`, `publisher`, `publication_date`, `edition`, `purchase_date`, `price`, `series`, `author`, `language`, `users`),
(`bookname`, `publisher`, `publication_date`, `edition`, `purchase_date`, `price`, `series`, `author`, `language`, `users`),
(`bookname`, `publisher`, `publication_date`, `edition`, `purchase_date`, `price`, `series`, `author`, `language`, `users`),
(`bookname`, `publisher`, `publication_date`, `edition`, `purchase_date`, `price`, `series`, `author`, `language`, `users`),
(`bookname`, `publisher`, `publication_date`, `edition`, `purchase_date`, `price`, `series`, `author`, `language`, `users`),
;

====


DROP TABLE IF EXISTS `t_punch_records`;
CREATE TABLE `t_punch_records` (
 `punch_id` int(10) NOT NULL AUTO_INCREMENT,
 `book_id` varchar(255) NOT NULL,
 `punch_createtime` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,   
 `datachange_createtime` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,   
 `datachange_lasttime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`punch_id`)) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
 
 
INSERT INTO `t_punch_records` ( `book_id`) VALUES
(1),
(2),
(4),
(5),
(8);

SQL连接查询语句（内、外、交叉和合并查询） http://blog.csdn.net/u010011371/article/details/50596535
内连接 （INNER JOIN）
select * from t_punch_records inner join t_books     
on t_punch_records.book_id=t_books.id;  

Select  punch_createtime,t_books.bookname as bookname     
from t_punch_records  left join t_books on t_punch_records.book_id=t_books.id; 


增加字段
    mysql> ALTER TABLE awsdatabase.t_punch_records ADD count int(11) default 1;
    mysql> ALTER TABLE awsdatabase.t_books ADD bookcover varchar(255) default null;
    mysql> UPDATE awsdatabase.t_books SET bookcover = '' WHERE publisher = '';


CREATE TABLE `users` (
 `id` int(10) NOT NULL,
 `username` varchar(32) NOT NULL,
 `password` varchar(64) NOT NULL,
 `email` varchar(50) NOT NULL,
 `profile_icon` varchar(255) NOT NULL,
 `apikey` varchar(255) NOT NULL,
 `datachange_createtime` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,   
 `datachange_lasttime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
 
 
INSERT INTO `users` (`id`, `username`, `password`, `email`, `profile_icon`, `apikey`) VALUES
(1, 'peter', '000c285457fc971f862a79b786476c78812c8897063c6fa9c045f579a3b2d63f', 'peter@example.com', 'peter.jpg', 'd0763edaa9d9bd2a9516280e9044d885'),
(2, 'marcia', '4d6b96d1e8f9bfcd28169bafe2e17da6e1a95f71e8ca6196d3affb4f95ca809f', 'marcia@example.com', 'marcia.jpg', 'd0763edaa9d9bd2a9516280e9044d885'),
(3, 'cindy', '81ba24935dd9a720826155382938610f1b74ba226e85a7b4ca2ad58cf06664fa', 'cindy@example.com', 'cindy.jpg', 'd0763edaa9d9bd2a9516280e9044d885'),
(4, 'mike', 'ef1b839067281c41a6abdf36ff2346700f9cd5f17d8d4e486be9e81c67779258', 'mike@example.com', 'mike.jpg', 'd0763edaa9d9bd2a9516280e9044d885');
 


ALTER TABLE `users`
 ADD PRIMARY KEY (`id`);
 

ALTER TABLE `users`
 MODIFY `id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;


-------------------------------------------------------------------------------------

http://www.bootstrap-year-calendar.com/

-------------------------------------------------------------------------------------
npm常用命令及版本号浅析
https://www.cnblogs.com/blackgan/p/7828047.html

-------------------------------------------------------------------------------------
https://www.gajotres.net/creating-a-basic-restful-api-with-silex/


-------------------------------------------------------------------------------------
Create REST API In Silex With User Authentication
http://www.cloudways.com/blog/create-rest-api-silex/

-------------------------------------------------------------------------------------

使用Bootstrap typeahead插件实现搜索框自动补全的方法
http://www.jb51.net/article/88098.htm

-------------------------------------------------------------------------------------
AWS RDS 解决时区，utf8问题
http://blog.csdn.net/freewebsys/article/details/52293874

show variables like '%time_zone%';
select now();

character_set_client utf8
character_set_connection utf8
character_set_database utf8
character_set_filesystem engine-default
character_set_results utf8
character_set_server utf8

-------------------------------------------------------------------------------------
bootstrap loading动画
https://www.bootply.com/tagged/animate


-------------------------------------------------------------------------------------
    // "bootstrap-year-calendar": "^1.1.1"

引入vux 需要升级node--放弃
https://vux.li/#/#

1. npm install --registry=https://registry.npm.taobao.org

2. npm install vux --save

Quick Start
3. npm install -g vue-cli

4. # init a webpack project with vuxjs/template
vue init vuxjs/webpack ./
cd ./
npm install
npm run dev

-------------------------------------------------------------------------------------
bootstrap插件学习-bootstrap.alert.js
https://www.bbsmax.com/A/QW5YZMD3dm/

-------------------------------------------------------------------------------------

配色
http://www.colorhunt.co/
https://uigradients.com/#Candy
https://webgradients.com/
https://color.adobe.com/zh/create/color-wheel/
https://www.colordrop.io/

-------------------------------------------------------------------------------------
Symfony2使用第三方库Upload制作图片上传【原创】
http://blog.it985.com/6544.html

-------------------------------------------------------------------------------------

composer.json版本号
https://docs.phpcomposer.com/01-basic-usage.html#Next-Significant-Release

像 ~1.2 （允许1.2以上的任何版本，但不包括2.0）


-------------------------------------------------------------------------------------
Upgrading Silex 1.x to 2.x
https://github.com/silexphp/Silex/wiki/Upgrading-Silex-1.x-to-2.x


-------------------------------------------------------------------------------------
https://getcomposer.org/doc/01-basic-usage.md#autoloading
You can even add your own code to the autoloader by adding an autoload field to composer.json.

{
    "autoload": {
        "psr-4": {"Acme\\": "src/"}
    }
}

Composer will register a PSR-4 autoloader for the Acme namespace.

You define a mapping from namespaces to directories. The src directory would be in your project root, on the same level as vendor directory is. An example filename would be src/Foo.php containing an Acme\Foo class.

After adding the autoload field, you have to re-run dump-autoload to re-generate the vendor/autoload.php file.


-------------------------------------------------------------------------------------
如何安装第三方Bundle
http://symfonychina.com/doc/current/bundles/installation.html


$ composer require friendsofsymfony/user-bundle "~2.0"


-------------------------------------------------------------------------------------

用Silex开发一个RESTful API（已完成）
https://www.gitbook.com/book/taylorr/-silex-restful-api/details

-------------------------------------------------------------------------------------


        // "symfony/symfony": "3.0.*",
        // "symfony/http-foundation": "~2.8|^3.0",


https://packagist.org/packages/symfony/filesystem
composer require symfony/filesystem






symfony/framework-bundle
https://github.com/symfony/framework-bundle


composer require symfony/framework-bundle

-------------------------------------------------------------------------------------

symphony文档
http://api.symfony.com/2.7/Symfony/Bundle/FrameworkBundle/Controller.html


-------------------------------------------------------------------------------------
Fatal error: Class 'finfo' not found in
一番查看搜索后得知，未安装和开启php的fileinfo扩展，解决方法
php -i|grep fileinfo 若出现 fileinfo fileinfo support => enabled 则代表fileinfo扩展可用,否则不可用。


修改php.ini

加入:extension=fileinfo.so


-------------------------------------------------------------------------------------
How to use controllers like in Symfony2 framework
https://gist.github.com/kix/3897241

-------------------------------------------------------------------------------------

使用 PuTTY 从 Windows 连接到 Linux 实例


-------------------------------------------------------------------------------------
复制一个数组
function runScripts() {
    if (arguments.length === 0) return;
    var args = [];
    Array.prototype.push.apply( args, arguments );

    chrome.tabs.executeScript(null, {
        file: args.shift();
    }, function() {
             // using the modified Array based on the original arguments object
        runScripts.apply(null, args);
    });
}


-------------------------------------------------------------------------------------
typeahead模糊搜索查询-结合bootstrap和jquery
http://blog.csdn.net/u011410529/article/details/70650707