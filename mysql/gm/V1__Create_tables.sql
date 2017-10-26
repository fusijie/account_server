CREATE TABLE `announcement` (
  `id` int(32) unsigned NOT NULL AUTO_INCREMENT,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `create_time` datetime DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `announcement` (`id`, `published`, `data`)
VALUES
  (1, 1, '这是一条公告');

CREATE TABLE `server_list` (
  `name` char(16) NOT NULL DEFAULT '',
  `label` char(64) DEFAULT NULL,
  `desc` varchar(252) DEFAULT NULL,
  `ip` char(16) DEFAULT NULL,
  `port` int(10) unsigned NOT NULL,
  `user` char(64) DEFAULT NULL,
  `password` char(64) DEFAULT NULL,
  `db` char(64) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `server_list` (`name`, `label`, `desc`, `ip`, `port`, `user`, `password`, `db`)
VALUES
  ('account', '账号服务器', '玩家账号服', '127.0.0.1', 7000, NULL, NULL, NULL),
  ('account_sql', '账号服sql配置', '账号服sql配置', '127.0.0.1', 3306, NULL, NULL, 'game_account');

CREATE TABLE `server_map` (
  `csid` int(10) unsigned NOT NULL,
  `ssid` int(10) NOT NULL,
  `name` char(64) NOT NULL DEFAULT '',
  `author` char(32) DEFAULT '',
  PRIMARY KEY (`csid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `server_map` (`csid`, `ssid`, `name`, `author`)
VALUES
  (1, 1, 'server_1', 'Jacky'),
  (2, 2, 'server_2', 'Jacky');

CREATE TABLE `server_game` (
  `ssid` int(10) unsigned NOT NULL,
  `name` char(16) DEFAULT NULL COMMENT '',
  `platform` char(16) DEFAULT NULL,
  `ip` char(16) NOT NULL DEFAULT '',
  `port` int(10) unsigned NOT NULL DEFAULT 7500 COMMENT 'gated端口，接收wsproxy转发的玩家消息',
  `open_time` datetime DEFAULT NULL,
  `state` tinyint(8) unsigned NOT NULL DEFAULT 0 COMMENT '状态：0：所有人不可见；1：所有玩家可见维护中, 2:所有玩家可见正常，11:只有GM账号可',

  PRIMARY KEY (`ssid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `server_game` (`ssid`, `name`, `ip`, `port`, `state`)
VALUES
  (1, 'server_1', '127.0.0.1', 7500, 2),
  (2, 'server_2', '127.0.0.2', 7500, 11);


