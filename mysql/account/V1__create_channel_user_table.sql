CREATE TABLE `account` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `platform` varchar(30) NOT NULL DEFAULT '' COMMENT '平台 0：android 1：ios 2：其他',
  `phone` int(20) DEFAULT NULL COMMENT '手机号，用于绑定',
  `account_id` varchar(64) NOT NULL DEFAULT '' COMMENT '账号ID',
  `password` varchar(64) DEFAULT NULL COMMENT '账号密码',
  `channel` int(20) unsigned NOT NULL COMMENT '渠道',
  `servers` varchar(50) DEFAULT NULL COMMENT '登陆过的服务器',
  `create_time` DATETIME NULL COMMENT '创建时间',
  `update_time` DATETIME NULL COMMENT '最后访问',
  `state` tinyint(8) NULL DEFAULT 1 COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;