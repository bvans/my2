set names utf8mb4;
CREATE DATABASE IF NOT EXISTS `my2` DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;
USE `my2`;

CREATE TABLE IF NOT EXISTS `my2`.`serial_num` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `sn_type` TINYINT(4) NOT NULL DEFAULT '0' COMMENT '0:新手序列号;1:老玩家序列号',
  `sn` varchar(32) NOT NULL DEFAULT '' COMMENT '序列号',
  `promo_page` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0否1是',
  `snStatus` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未使用1已使用',
  `apply_date` timestamp NOT NULL DEFAULT '1970-01-02 00:00:01' COMMENT '申请时间',
  `expire_date` timestamp NOT NULL DEFAULT '1970-01-02 00:00:01' COMMENT '过期时间',
  PRIMARY KEY (`id`) COMMENT '自增主键',
  UNIQUE KEY `idx_sn`(`sn`) COMMENT '序列号',
  KEY `idx_type_status_expire_date`(`sn_type`,`snStatus`,`expire_date`) USING BTREE COMMENT '未使用未过期的序列号'
) ENGINE=InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COMMENT = '序列号表';
