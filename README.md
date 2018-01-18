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



http://127.0.0.1:8099/mixmatch/pages/index.html
http://10.32.80.152:8099/mixmatch/pages/index.html

cd D:/Users/zhangxy/Documents/Learning/www/Apache24/bin
httpd -k restart -n "ApacheServer"

D:\Users\zhangxy\Documents\Learning\www\Apache24\conf\httpd.conf
DocumentRoot "D:/Users/zhangxy/Documents/Learning/www/Apache24/htdocs/readingKidz/web"
<Directory "D:/Users/zhangxy/Documents/Learning/www/Apache24/htdocs/readingKidz/web">

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
DROP TABLE IF EXISTS `t_books`;
CREATE TABLE `t_books` (
  `barcode` int(11) NOT NULL AUTO_INCREMENT,
  -- `barcode` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'barcode',
  `skuName` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '单品名称',
  `skuType` int(11) NOT NULL COMMENT '单品所在类别',
  `skuStatus` int(11) NOT NULL COMMENT '单品状态',
  -- 1canuse2cantuse3canbuy4lookfor5droped
  `price` float NOT NULL COMMENT '单品价格',
  -- `count` int(11) NOT NULL COMMENT '库存',
  `channel` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '购买渠道',
  `brand` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '品牌',
  `size` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '尺码',
  `purchaseDate` datetime DEFAULT NULL,
  `photo` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '单品照片',
  -- PRIMARY KEY (`barcode`,`count`),
  PRIMARY KEY (`barcode`),
  KEY `skuType` (`skuType`),
  CONSTRAINT `t_sku_ibfk_1` FOREIGN KEY (`skuType`) REFERENCES `t_skuclass` (`skuClassId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_books
-- ----------------------------
INSERT INTO `t_books` VALUES ('1', '冬款小公主加厚保暖印花中筒袜', '4', '1', '17.00', '淘宝戴维贝拉旗舰店', '戴维贝拉davebella','9cm','2017-10-25 20:58:19', './upload/2013/07/20074100.jpg');
INSERT INTO `t_books` VALUES ('2', '冬款加厚保暖条纹印花中筒袜', '4', '1', '17.00', '淘宝戴维贝拉旗舰店', '戴维贝拉davebella','9cm','2017-10-25 20:58:19', './upload/2013/07/20074100.jpg');
INSERT INTO `t_books` VALUES ('3', '婴儿马甲粉小熊', '1', '1', '59.00', '老豆商城七天无理由退换货', '无','86cm(12-18月)','2017-10-21 18:51:08', './upload/2013/07/20074100.jpg');


-------------------------------------------------------------------------------------



-- ----------------------------
-- Records of t_books
-- ----------------------------
INSERT INTO `t_books` VALUES ('1', '书名', '出版社', '2017-1-1', '第1版', '2018-2-31', '56.33','系列书籍','作者', '语言', 'zxy', '2017-10-25 20:58:19', '2017-10-25 20:58:19');


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


<!-- CREATE TABLE `awsdatabase`.`t_books` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'book id',
  `bookname` VARCHAR(45) NOT NULL DEFAULT '' COMMENT '书名',
  `publisher` VARCHAR(45) NOT NULL DEFAULT '',
  `publication_date` DATE NOT NULL DEFAULT '',
  `edition` VARCHAR(45) NOT NULL DEFAULT '',
  `purchase_date` DATE NOT NULL DEFAULT '',
  `price` FLOAT NOT NULL DEFAULT 0,
  `datachange_createtime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `datachange_lasttime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `series` CHAR(4) NOT NULL DEFAULT '',
  `author` VARCHAR(50) NOT NULL DEFAULT '',
  `language` VARCHAR(45) NOT NULL DEFAULT '',
  `users` VARCHAR(45) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`));
 -->

------------------------------------------------------------------------------------------------------------
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