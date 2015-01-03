CREATE DATABASE  IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `test`;
-- MySQL dump 10.13  Distrib 5.5.40, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: test
-- ------------------------------------------------------
-- Server version	5.5.40-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `abilities`
--

DROP TABLE IF EXISTS `abilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `abilities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cost` int(11) NOT NULL DEFAULT '0',
  `required_level` int(11) NOT NULL DEFAULT '0',
  `description` text,
  `scalable` int(11) NOT NULL DEFAULT '1',
  `scale` float NOT NULL DEFAULT '1',
  `standard` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `abilities`
--

LOCK TABLES `abilities` WRITE;
/*!40000 ALTER TABLE `abilities` DISABLE KEYS */;
INSERT INTO `abilities` VALUES (1,'rew1',150,1,'It has a description',1,2,0);
/*!40000 ALTER TABLE `abilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `admin` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `admin_id` int(11) NOT NULL DEFAULT '-1',
  `live` int(11) NOT NULL DEFAULT '1',
  `details` text COLLATE utf8_unicode_ci,
  `raw_details` text COLLATE utf8_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'public',
  `upvotes` int(11) NOT NULL DEFAULT '0',
  `downvotes` int(11) NOT NULL DEFAULT '0',
  `link` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `site_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `views` int(11) NOT NULL DEFAULT '0',
  `removed` int(11) NOT NULL DEFAULT '0',
  `members` int(11) NOT NULL DEFAULT '0',
  `group` int(11) NOT NULL DEFAULT '0',
  `nsfw` int(11) NOT NULL DEFAULT '0',
  `pinned` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
INSERT INTO `chats` VALUES (1,'A new test chat','Omnium',1,1,NULL,NULL,'2014-01-12 05:59:23','2014-12-28 19:59:01','open',0,0,NULL,NULL,NULL,56,1,0,0,0,0),(2,'A test chat','Omnium',1,0,'','','2014-01-12 22:02:41','2014-12-21 23:17:36','open',0,0,NULL,NULL,NULL,921,0,0,0,0,0),(3,'Testing images','Omnium',1,1,'Just a test description with some <em>markdown</em> basics in it and a link<br />\nto the author of course <a class=\'chat_link\' href=\'\\/\\/mutualcog.com/u/Omnium\'>/u/Omnium</a><br />\nwhat happens if I put another line in here? <strong>hmmmm</strong>','Just a test description with some *markdown* basics in it and a link\r\nto the author of course /p/Omnium\r\nwhat happens if I put another line in here? **hmmmm**','2014-03-10 16:28:56','2014-10-30 17:59:03','live',0,0,'http://i.imgur.com/LJ8zguP.jpg','http://i.imgur.com/LJ8zguP.jpg','i.imgur.com',294,0,0,0,0,0),(4,'Testing the advanced controls and stuff','Omnium',1,0,'Just a description <em>with</em> some markdown <a class=\'chat_link\' href=\'\\/\\/mutualcog.com/u/Omnium\'>/u/Omnium</a>','Just a description *with* some markdown /p/Omnium','2014-03-13 03:26:10','2014-12-23 23:39:12','open',100,0,NULL,NULL,NULL,22,0,0,0,0,0),(5,'Creating a static chat','Omnium',1,1,'Hello <a class=\'chat_link\' href=\'\\/\\/mutualcog.com/p/Omnium\'>@Omnium</a>','Hello @Omnium','2014-03-13 03:29:03','2014-08-05 04:46:07','open',0,0,NULL,NULL,NULL,459,1,0,0,0,0),(6,'testing static stuff','Omnium',1,1,'a chat about testing','a chat about testing','2014-03-13 03:37:28','2014-12-23 23:15:29','open',0,0,NULL,NULL,NULL,350,0,0,0,0,0),(8,'A second chat','Bob',4,1,'Stuff I need to look at','Stuff I need to look at','2014-04-06 20:35:38','2014-12-31 22:28:04','open',0,0,NULL,NULL,NULL,431,0,0,0,0,1),(11,'Spam and stuff','Omnium',1,1,'lots of spam','lots of spam','2014-09-03 17:50:50','2014-10-31 22:11:06','public',0,0,'http://imgur.com/gallery/jOnfC','//i.imgur.com/RVrn058.jpg?1','imgur.com',13,0,0,0,0,0),(12,'Lots and lots of philosophy','Omnium',1,1,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa<strong>aaaaaaaaaa</strong>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa**aaaaaaaaaa**aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','2014-10-16 18:07:13','2014-11-11 15:52:08','public',0,0,NULL,NULL,NULL,127,0,0,0,0,0),(13,'High level thought','Omnium',1,1,'Blah de blah de existentialism blah','Blah de blah de existentialism blah','2014-10-16 18:07:55','2014-11-27 20:59:19','public',0,0,NULL,NULL,NULL,2,0,0,0,1,0),(14,'My first post','Bob',2,1,'A post  about science and philosophy and math','A post  about science and philosophy and math','2014-10-17 19:19:26','2015-01-01 16:25:57','public',0,0,NULL,NULL,NULL,71,0,0,0,0,0),(16,'Kittenses','Omnium',1,1,'cuteness','cuteness','2014-10-22 01:31:05','2014-12-31 22:27:02','public',0,0,'http://www.youtube.com/watch?v=_zqn6FtdDGc','http://localhost/laravel/YouTube-logo-full_color.png','www.youtube.com',27,0,0,0,0,0);
/*!40000 ALTER TABLE `chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chats_to_communities`
--

DROP TABLE IF EXISTS `chats_to_communities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chats_to_communities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `community_id` int(11) NOT NULL,
  `removed` int(11) NOT NULL DEFAULT '0',
  `pinned` int(11) NOT NULL DEFAULT '0',
  `upvotes` int(11) NOT NULL DEFAULT '0',
  `downvotes` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `chat_id` (`chat_id`,`community_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats_to_communities`
--

LOCK TABLES `chats_to_communities` WRITE;
/*!40000 ALTER TABLE `chats_to_communities` DISABLE KEYS */;
INSERT INTO `chats_to_communities` VALUES (1,1,1,0,0,0,0),(2,2,2,0,1,0,0),(3,3,2,0,0,0,0),(4,4,2,0,0,0,0),(5,5,3,0,0,0,0),(6,5,4,0,0,0,0),(7,5,5,0,0,0,0),(8,6,6,0,0,0,0),(9,6,7,0,0,0,0),(10,6,8,0,0,0,0),(11,6,9,0,0,0,0),(12,8,10,0,0,0,0),(13,8,11,0,0,0,0),(14,8,12,0,0,0,0),(15,8,13,0,0,0,0),(18,11,1,0,0,0,0),(19,12,1,0,0,0,0),(20,13,1,0,0,0,0),(21,14,1,0,0,0,0),(23,16,1,0,0,0,0),(25,18,1,0,0,0,0),(26,19,1,0,0,0,0),(27,20,1,0,0,0,0),(28,21,1,0,0,0,0),(29,22,1,0,0,0,0),(30,1,1,0,0,0,0),(31,2,2,0,0,0,0),(32,3,1,0,0,0,0),(33,4,1,0,0,0,0),(34,5,1,0,0,0,0),(35,6,1,0,1,0,0),(36,7,1,0,0,0,0),(37,8,1,0,0,0,0),(41,11,15,0,0,0,0),(42,12,4,0,0,0,0),(43,13,3,0,0,0,0),(44,14,5,0,0,0,0),(45,14,6,0,0,0,0),(47,16,16,0,0,0,0);
/*!40000 ALTER TABLE `chats_to_communities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chats_voted`
--

DROP TABLE IF EXISTS `chats_voted`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chats_voted` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats_voted`
--

LOCK TABLES `chats_voted` WRITE;
/*!40000 ALTER TABLE `chats_voted` DISABLE KEYS */;
INSERT INTO `chats_voted` VALUES (1,12,1,1,'2014-10-16 18:07:13','2014-10-24 16:45:27'),(2,13,1,1,'2014-10-16 18:07:55','2014-10-16 18:07:55'),(3,14,2,1,'2014-10-17 19:19:26','2014-10-17 19:19:26'),(4,15,1,1,'2014-10-22 01:15:57','2014-10-22 01:15:57'),(5,16,1,1,'2014-10-22 01:31:05','2014-10-22 01:31:05'),(6,6,1,0,'2014-10-24 16:27:53','2014-10-24 16:45:18'),(7,17,1,1,'2014-10-29 19:06:10','2014-10-29 19:06:10');
/*!40000 ALTER TABLE `chats_voted` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `communities`
--

DROP TABLE IF EXISTS `communities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `communities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `popularity` int(11) NOT NULL DEFAULT '1',
  `admin` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `description` text COLLATE utf8_unicode_ci,
  `info` text COLLATE utf8_unicode_ci,
  `raw_info` text COLLATE utf8_unicode_ci,
  `nsfw` int(11) NOT NULL DEFAULT '0',
  `concept_id` int(11) NOT NULL,
  `tier` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `tag` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `communities`
--

LOCK TABLES `communities` WRITE;
/*!40000 ALTER TABLE `communities` DISABLE KEYS */;
INSERT INTO `communities` VALUES (1,'testing',NULL,'2014-10-24 16:45:27',22,'Omnium','','<strong>General Info</strong><br />\nA community for:</p>\n<ol>\n<li>testing</li>\n<li>more testing</li>\n<li>even more testing</li>\n</ol>','**General Info**\r\nA community for:\r\n1. testing\r\n2. more testing\r\n3. even more testing\r\n\r\n\r\n\r\n',0,0,0),(2,'test',NULL,'2014-08-25 23:36:20',4,'Omnium','','','',0,0,0),(3,'science',NULL,'2014-10-16 18:07:55',2,'Omnium',NULL,NULL,'',0,0,0),(4,'philosophy',NULL,'2014-10-24 16:45:27',1,'0',NULL,NULL,'',0,0,0),(5,'nature',NULL,'2014-10-17 19:19:26',1,'0',NULL,NULL,'',0,0,0),(6,'something',NULL,'2014-10-24 16:45:16',1,'0',NULL,NULL,'',0,0,0),(7,'technology',NULL,'2014-10-24 16:45:16',0,'0',NULL,NULL,'',0,0,0),(8,'physics',NULL,'2014-10-24 16:45:16',0,'0',NULL,NULL,'',0,0,0),(9,'probability',NULL,'2014-10-24 16:45:16',0,'0',NULL,NULL,'',0,0,0),(10,'asfasdfasdfasdf',NULL,NULL,0,'0',NULL,NULL,'',0,0,0),(11,'asffdsweffdwe',NULL,NULL,0,'0',NULL,NULL,'',0,0,0),(12,'sdfwefdsasdfwf',NULL,NULL,0,'0',NULL,NULL,'',0,0,0),(13,'sdfewfasdwef',NULL,NULL,0,'0',NULL,NULL,'',0,0,0),(14,'asdfsdfdsfewdffs',NULL,NULL,0,'0',NULL,NULL,'',0,0,0),(15,'spam','2014-09-03 17:28:47','2014-09-03 17:50:50',3,'0',NULL,NULL,NULL,0,0,0),(16,'aww','2014-10-22 01:15:57','2014-10-22 01:31:05',2,'0',NULL,NULL,NULL,0,0,0),(17,'tag','2014-10-29 19:06:10','2014-10-29 19:06:10',1,'0',NULL,NULL,NULL,0,0,0);
/*!40000 ALTER TABLE `communities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concepts`
--

DROP TABLE IF EXISTS `concepts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `concepts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concepts`
--

LOCK TABLES `concepts` WRITE;
/*!40000 ALTER TABLE `concepts` DISABLE KEYS */;
/*!40000 ALTER TABLE `concepts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entities_to_concepts`
--

DROP TABLE IF EXISTS `entities_to_concepts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entities_to_concepts` (
  `id` int(11) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `concept_id` int(11) NOT NULL,
  `entity_type` varchar(255) NOT NULL DEFAULT 'user',
  `similarity` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `concept_idx` (`concept_id`),
  KEY `entity_idx` (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entities_to_concepts`
--

LOCK TABLES `entities_to_concepts` WRITE;
/*!40000 ALTER TABLE `entities_to_concepts` DISABLE KEYS */;
/*!40000 ALTER TABLE `entities_to_concepts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interaction_users`
--

DROP TABLE IF EXISTS `interaction_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `interaction_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `friended` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `bond` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_idx` (`user_id`),
  KEY `interaction_idx` (`entity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interaction_users`
--

LOCK TABLES `interaction_users` WRITE;
/*!40000 ALTER TABLE `interaction_users` DISABLE KEYS */;
INSERT INTO `interaction_users` VALUES (1,1,2,0,1,'2014-10-09 14:51:00','2014-12-30 19:33:21',0.97),(2,2,1,0,1,'2014-10-09 14:51:00','2015-01-01 16:26:32',0.91),(3,2,3,0,1,'2014-10-20 18:57:30','2015-01-01 15:36:53',0.9),(4,3,2,0,1,'2014-10-20 18:57:30','2014-10-20 18:58:18',1);
/*!40000 ALTER TABLE `interaction_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` text COLLATE utf8_unicode_ci NOT NULL,
  `chat_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `responseto` int(11) NOT NULL,
  `parent` int(11) NOT NULL DEFAULT '0',
  `y_dim` int(11) NOT NULL DEFAULT '0',
  `res_num` int(11) NOT NULL DEFAULT '0',
  `responses` int(11) NOT NULL DEFAULT '0',
  `author` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `serial` int(11) NOT NULL,
  `upvotes` int(11) NOT NULL DEFAULT '0',
  `downvotes` int(11) NOT NULL DEFAULT '0',
  `path` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `readable` int(11) NOT NULL DEFAULT '0',
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'public',
  PRIMARY KEY (`id`),
  KEY `chat_id` (`chat_id`,`user_id`),
  KEY `member_idx` (`user_id`),
  KEY `responseto` (`responseto`),
  KEY `author` (`author`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'test',14,1,'2014-12-31 17:56:50','2014-12-31 17:56:50',0,0,0,0,0,'Omnium',53045638,0,0,'0.00000001',1,'public'),(2,'testing',14,2,'2014-12-31 18:06:47','2014-12-31 18:06:47',0,0,0,0,0,'Bob',36529634,0,0,'0.00000002',1,'public'),(3,'out',14,2,'2014-12-31 18:06:48','2014-12-31 18:06:48',0,0,0,0,0,'Bob',36529634,0,0,'0.00000003',1,'public'),(4,'this',14,2,'2014-12-31 18:06:49','2014-12-31 18:06:49',0,0,0,0,0,'Bob',36529634,0,0,'0.00000004',1,'public'),(5,'chat',14,2,'2014-12-31 18:06:50','2014-12-31 18:06:50',0,0,0,0,0,'Bob',36529634,0,0,'0.00000005',1,'public'),(6,'to',14,2,'2014-12-31 18:06:51','2014-12-31 18:06:51',0,0,0,0,0,'Bob',36529634,0,0,'0.00000006',1,'public'),(7,'see',14,2,'2014-12-31 18:06:52','2014-12-31 18:06:52',0,0,0,0,0,'Bob',36529634,0,0,'0.00000007',1,'public'),(8,'if',14,2,'2014-12-31 18:06:53','2014-12-31 18:06:53',0,0,0,0,0,'Bob',36529634,0,0,'0.00000008',1,'public'),(9,'the scrollbar',14,2,'2014-12-31 18:06:55','2014-12-31 18:06:55',0,0,0,0,0,'Bob',36529634,0,0,'0.00000009',1,'public'),(10,'is',14,2,'2014-12-31 18:06:56','2014-12-31 18:06:56',0,0,0,0,0,'Bob',36529634,0,0,'0.00000010',1,'public'),(11,'going to',14,2,'2014-12-31 18:06:57','2014-12-31 18:06:57',0,0,0,0,0,'Bob',36529634,0,0,'0.00000011',1,'public'),(12,'work ',14,2,'2014-12-31 18:06:59','2014-12-31 18:06:59',0,0,0,0,0,'Bob',36529634,0,0,'0.00000012',1,'public'),(13,'properly',14,2,'2014-12-31 18:07:01','2014-12-31 18:07:01',0,0,0,0,0,'Bob',36529634,0,0,'0.00000013',1,'public'),(14,'test',14,2,'2014-12-31 18:07:25','2014-12-31 18:07:25',0,0,0,0,0,'Bob',36529634,0,0,'0.00000014',1,'public'),(15,'gotta test again',14,2,'2014-12-31 18:07:41','2014-12-31 18:07:41',0,0,0,0,1,'Bob',36529634,0,0,'0.00000015',1,'public'),(16,'test',14,2,'2015-01-01 16:04:09','2015-01-01 16:04:09',0,0,0,0,0,'Bob',223861519,0,0,'0.00000016',1,'public'),(17,'another test',14,2,'2015-01-01 16:07:40','2015-01-01 16:07:40',0,0,0,0,0,'Bob',223861519,0,0,'0.00000017',1,'public'),(18,'tes',14,2,'2015-01-01 16:11:14','2015-01-01 16:11:14',0,0,0,0,0,'Bob',223861519,0,0,'0.00000018',1,'public'),(19,'testing',14,2,'2015-01-01 16:25:24','2015-01-01 16:25:24',0,0,0,0,0,'Bob',223861519,0,0,'0.00000019',1,'public'),(20,'bleh',14,2,'2015-01-01 16:25:30','2015-01-01 16:25:30',0,0,0,0,0,'Bob',223861519,0,0,'0.00000020',1,'public'),(21,'gotta make sure <strong>everything</strong> is <em><strong>working</strong></em>',14,2,'2015-01-01 16:25:49','2015-01-01 16:25:49',15,15,1,1,0,'Bob',223861519,0,0,'0.00000015.00000021',1,'public');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages_voted`
--

DROP TABLE IF EXISTS `messages_voted`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages_voted` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages_voted`
--

LOCK TABLES `messages_voted` WRITE;
/*!40000 ALTER TABLE `messages_voted` DISABLE KEYS */;
INSERT INTO `messages_voted` VALUES (1,1,1,1,'2014-12-31 17:56:50','2014-12-31 17:56:50'),(2,2,2,1,'2014-12-31 18:06:47','2014-12-31 18:06:47'),(3,3,2,1,'2014-12-31 18:06:48','2014-12-31 18:06:48'),(4,4,2,1,'2014-12-31 18:06:49','2014-12-31 18:06:49'),(5,5,2,1,'2014-12-31 18:06:50','2014-12-31 18:06:50'),(6,6,2,1,'2014-12-31 18:06:51','2014-12-31 18:06:51'),(7,7,2,1,'2014-12-31 18:06:52','2014-12-31 18:06:52'),(8,8,2,1,'2014-12-31 18:06:53','2014-12-31 18:06:53'),(9,9,2,1,'2014-12-31 18:06:55','2014-12-31 18:06:55'),(10,10,2,1,'2014-12-31 18:06:56','2014-12-31 18:06:56'),(11,11,2,1,'2014-12-31 18:06:57','2014-12-31 18:06:57'),(12,12,2,1,'2014-12-31 18:06:59','2014-12-31 18:06:59'),(13,13,2,1,'2014-12-31 18:07:01','2014-12-31 18:07:01'),(14,14,2,1,'2014-12-31 18:07:25','2014-12-31 18:07:25'),(15,15,2,1,'2014-12-31 18:07:41','2014-12-31 18:07:41'),(16,16,2,1,'2015-01-01 16:04:09','2015-01-01 16:04:09'),(17,17,2,1,'2015-01-01 16:07:40','2015-01-01 16:07:40'),(18,18,2,1,'2015-01-01 16:11:14','2015-01-01 16:11:14'),(19,19,2,1,'2015-01-01 16:25:24','2015-01-01 16:25:24'),(20,20,2,1,'2015-01-01 16:25:30','2015-01-01 16:25:30'),(21,21,2,1,'2015-01-01 16:25:49','2015-01-01 16:25:49');
/*!40000 ALTER TABLE `messages_voted` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `node_auth`
--

DROP TABLE IF EXISTS `node_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `node_auth` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user` varchar(255) NOT NULL,
  `serial` varchar(255) NOT NULL,
  `serial_id` int(11) NOT NULL,
  `sid` text NOT NULL,
  `authorized` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=552 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `node_auth`
--

LOCK TABLES `node_auth` WRITE;
/*!40000 ALTER TABLE `node_auth` DISABLE KEYS */;
INSERT INTO `node_auth` VALUES (546,2,'Bob','181413442',5,'c38e29d3276ef4339c32c2bbe895f46689e7841b',1),(548,2,'Bob','36529634',7,'77796a5f35d1cf9f02c708c114c6b5a04d3d9931',1),(550,2,'Bob','25934691',8,'b3b073797621a5b11bdd1fa4c67d1d66797b19b6',1),(551,2,'Bob','223861519',9,'b3b073797621a5b11bdd1fa4c67d1d66797b19b6',1);
/*!40000 ALTER TABLE `node_auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `global_type` varchar(255) DEFAULT NULL,
  `message` text,
  `seen` int(11) NOT NULL DEFAULT '0',
  `sender_id` int(11) NOT NULL DEFAULT '0',
  `sender` varchar(255) DEFAULT NULL,
  `sender_type` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `private_chats`
--

DROP TABLE IF EXISTS `private_chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `private_chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `total_messages` int(11) NOT NULL DEFAULT '0',
  `member_count` int(11) NOT NULL DEFAULT '2',
  `seen` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `private_chats`
--

LOCK TABLES `private_chats` WRITE;
/*!40000 ALTER TABLE `private_chats` DISABLE KEYS */;
INSERT INTO `private_chats` VALUES (1,NULL,'2014-10-09 14:51:05','2014-10-09 14:51:05',0,2,0),(2,NULL,'2014-10-09 18:25:19','2014-10-20 18:58:18',1,2,1);
/*!40000 ALTER TABLE `private_chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `private_messages`
--

DROP TABLE IF EXISTS `private_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `private_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` text NOT NULL,
  `chat_id` int(11) NOT NULL,
  `author` varchar(255) NOT NULL,
  `author_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `private_messages`
--

LOCK TABLES `private_messages` WRITE;
/*!40000 ALTER TABLE `private_messages` DISABLE KEYS */;
INSERT INTO `private_messages` VALUES (1,'test',1,'Omnium',1,'2014-10-15 19:26:11','2014-10-15 19:26:11'),(2,'got',1,'Bob',2,'2014-10-20 18:59:46','2014-10-20 18:59:46'),(3,'to',1,'Bob',2,'2014-10-20 18:59:48','2014-10-20 18:59:48'),(4,'get',1,'Bob',2,'2014-10-20 18:59:49','2014-10-20 18:59:49'),(5,'a',1,'Bob',2,'2014-10-20 18:59:49','2014-10-20 18:59:49'),(6,'scroll',1,'Bob',2,'2014-10-20 18:59:51','2014-10-20 18:59:51'),(7,'bar',1,'Bob',2,'2014-10-20 18:59:52','2014-10-20 18:59:52'),(8,'in',1,'Bob',2,'2014-10-20 18:59:52','2014-10-20 18:59:52'),(9,'here',1,'Bob',2,'2014-10-20 18:59:55','2014-10-20 18:59:55'),(10,'heyo',1,'Omnium',1,'2014-10-21 19:48:15','2014-10-21 19:48:15'),(11,'gotta test stuff',1,'Bob',2,'2014-12-19 22:57:08','2014-12-19 22:57:08'),(12,'testing more stuff',1,'Bob',2,'2014-12-19 22:57:11','2014-12-19 22:57:11'),(13,'do emojis work <img style=\"height:18px;\" src=\"//localhost/laravel/app/emoji/smiley.png\"></img>',1,'Bob',2,'2014-12-19 22:57:17','2014-12-19 22:57:17'),(14,'they do ;)',1,'Bob',2,'2014-12-19 22:57:21','2014-12-19 22:57:21'),(15,'hey bob <img style=\"height:18px;\" src=\"//localhost/laravel/app/emoji/smiley.png\"></img>',1,'Omnium',1,'2014-12-30 19:29:57','2014-12-30 19:29:57'),(16,'hi',1,'Omnium',1,'2014-12-30 19:33:21','2014-12-30 19:33:21'),(17,'<img style=\"height:18px;\" src=\"//localhost/laravel/app/emoji/heart.png\"></img>',1,'Bob',2,'2015-01-01 16:26:32','2015-01-01 16:26:32');
/*!40000 ALTER TABLE `private_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serials`
--

DROP TABLE IF EXISTS `serials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `serials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serial_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `last_post` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `ip_address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `welcomed` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serials`
--

LOCK TABLES `serials` WRITE;
/*!40000 ALTER TABLE `serials` DISABLE KEYS */;
INSERT INTO `serials` VALUES (1,104085737,'2014-12-29 00:37:15','2014-12-29 00:37:15','0','127.0.0.1',0),(2,19740191,'2014-12-30 01:32:29','2014-12-30 01:32:29','0','127.0.0.1',0),(3,28062106,'2014-12-30 18:43:22','2014-12-30 19:31:30','0','127.0.0.1',0),(4,222120717,'2014-12-30 20:52:11','2014-12-30 21:27:13','0','127.0.0.1',0),(5,181413442,'2014-12-30 20:52:38','2014-12-30 21:23:05','0','127.0.0.1',0),(6,53045638,'2014-12-31 17:44:24','2014-12-31 17:56:50','0','127.0.0.1',0),(7,36529634,'2014-12-31 18:04:40','2014-12-31 18:07:41','0','127.0.0.1',0),(8,25934691,'2014-12-31 22:06:58','2014-12-31 22:06:58','0','127.0.0.1',0),(9,223861519,'2015-01-01 15:36:53','2015-01-01 16:25:49','0','127.0.0.1',0);
/*!40000 ALTER TABLE `serials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `serial_id` int(11) NOT NULL DEFAULT '0',
  `cognizance` int(11) NOT NULL DEFAULT '0',
  `total_cognizance` int(11) NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL DEFAULT '0',
  `next_level` int(11) NOT NULL DEFAULT '120',
  `last_login` datetime NOT NULL,
  `is_admin` int(11) NOT NULL DEFAULT '0',
  `page` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'home',
  `chat_id` int(11) NOT NULL DEFAULT '0',
  `anonymous` int(11) NOT NULL DEFAULT '0',
  `evaluated` int(11) NOT NULL DEFAULT '1',
  `disconnecting` int(11) NOT NULL DEFAULT '0',
  `disconnect_time` datetime DEFAULT NULL,
  `online` int(11) NOT NULL DEFAULT '0',
  `ip_address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `community_mod` int(11) NOT NULL DEFAULT '0',
  `community_admin` int(11) NOT NULL DEFAULT '0',
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `passive` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `name` (`name`,`level`,`is_admin`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2014-10-09 14:47:29','2014-12-31 22:28:50','Omnium','eyJpdiI6IndPMUExaVc1am1QVWh6RERrQmJaTkpJTnhCY1dLVXRBMnR6TUtPcUlEbXM9IiwidmFsdWUiOiJrNFpGanFHZ21YTUcyMVhxUmpGdW1XeUk5V1NYNlwvb2srdFBMd3NxbXFHVT0iLCJtYWMiOiJiNzZmOWNjMDUyOTUwNzBlNjFkOTBkN2Y1MWE4YzY1YjJkODY4NDUwNjc2NzIxZDFiYTNmMTBmMzAzMzA3NzE0In0=',NULL,8,49,176,1,300,'2014-12-23 23:43:09',1,'home',0,0,1,0,'2014-12-31 22:28:50',0,'127.0.0.1',0,0,'Id6HPbLkkYCc7eXGuFICIMmZ07KDQ7GJtS88WqAXftCgvH9GFPLvFpYaGXZm',5),(2,'2014-10-09 14:50:28','2015-01-01 16:27:05','Bob','eyJpdiI6ImtuK1ZYWWs1TnBxNExodHkrUkNwXC90bytoNzNyNGtNMXZLalNmNlljQldJPSIsInZhbHVlIjoiaHpWUk1CQk5maGs0OFc3MjZWSVBJSVlqRVJyUEg1cDVjMEtSSzRhRnJKbz0iLCJtYWMiOiJiNTU4YzY4MzIzZGE3MzcwYjIxNmQxYmU5MDU5ZjM4Y2RmZDU4ZmE4MGQyOGUwYzFjNDJmN2ZhYmVhMjI1MjRiIn0=',NULL,9,18,19,0,120,'2014-12-31 22:28:55',0,'home',0,0,1,0,'2015-01-01 16:26:52',1,'127.0.0.1',0,0,'hAORlo2ErYnWGMq6EXEzvDDLjkemq3Fc9NTmmWYtMpmrrTw5fXTTqVyXuNEb',9),(3,'2014-10-09 18:24:23','2014-11-13 15:43:12','Test','eyJpdiI6IjVrTTB2blA0SGs4azI0ZEhPUEdlUEZFWjhcLzdcL2Qzc1lldzBKakFWMG4wWT0iLCJ2YWx1ZSI6IkhDTkxQNVhJYWZwK0ZZNWMwblRMR0xmWE1xd29CcUR0YVZnbEZsK25pbm89IiwibWFjIjoiOWE2OTlhODhlODZiNWRhNDgzNDAzOWRiODMxOTlkNTk4OWQ0ZjU2MmU1NzY2NGQ3N2I2ODQzNTY5NmQ3OGM5YiJ9',NULL,38,0,0,0,120,'2014-11-13 15:42:55',0,'home',0,0,1,1,'2014-11-13 15:43:13',0,'127.0.0.1',0,0,'OhJmYli0EQR6f3GM2z2LerHLuzIXOpPh62r7aXLbI1Hk0FUiIWOeZvJaAJk6',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_to_abilities`
--

DROP TABLE IF EXISTS `users_to_abilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_to_abilities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `ability_id` int(11) NOT NULL,
  `active` int(11) NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `unlocked` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_to_abilities`
--

LOCK TABLES `users_to_abilities` WRITE;
/*!40000 ALTER TABLE `users_to_abilities` DISABLE KEYS */;
INSERT INTO `users_to_abilities` VALUES (1,1,1,0,2,'2014-12-22 22:42:41','2014-12-24 00:16:39',1);
/*!40000 ALTER TABLE `users_to_abilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_to_chats`
--

DROP TABLE IF EXISTS `users_to_chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_to_chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_mod` int(11) NOT NULL,
  `is_admin` int(11) NOT NULL,
  `user` varchar(255) NOT NULL,
  `active` int(11) NOT NULL DEFAULT '0',
  `banned` int(11) NOT NULL DEFAULT '0',
  `ip_address` varchar(255) NOT NULL,
  `is_user` int(11) NOT NULL,
  `live` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `chat_id` (`chat_id`,`user_id`),
  KEY `author` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_to_chats`
--

LOCK TABLES `users_to_chats` WRITE;
/*!40000 ALTER TABLE `users_to_chats` DISABLE KEYS */;
INSERT INTO `users_to_chats` VALUES (1,6,1,0,1,'Omnium',1,0,'127.0.0.1',1,1),(2,6,38,0,0,'198339714',0,0,'127.0.0.1',0,1),(3,6,2,0,0,'Bob',1,0,'127.0.0.1',1,1),(4,6,43,0,0,'134689452',1,0,'127.0.0.1',0,1),(5,8,1,0,0,'Omnium',0,0,'127.0.0.1',1,1),(6,8,44,0,0,'91166710',0,0,'127.0.0.1',0,1),(7,8,2,0,1,'Bob',0,0,'127.0.0.1',1,1),(8,16,2,0,0,'Bob',0,0,'127.0.0.1',1,1),(9,14,2,0,1,'Bob',0,0,'127.0.0.1',1,1),(10,13,2,0,0,'Bob',0,0,'127.0.0.1',1,1),(11,2,2,0,0,'Bob',0,0,'',0,1),(12,1,1,0,1,'Omnium',0,0,'127.0.0.1',1,1),(13,4,2,0,0,'Bob',0,0,'',0,1),(14,16,1,0,1,'Omnium',0,0,'127.0.0.1',1,1),(15,14,1,0,0,'Omnium',0,1,'127.0.0.1',1,1);
/*!40000 ALTER TABLE `users_to_chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_to_communities`
--

DROP TABLE IF EXISTS `users_to_communities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_to_communities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `community_id` int(11) NOT NULL,
  `score` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_mod` int(11) NOT NULL DEFAULT '0',
  `is_admin` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_idx` (`user_id`),
  KEY `tag_idx` (`community_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_to_communities`
--

LOCK TABLES `users_to_communities` WRITE;
/*!40000 ALTER TABLE `users_to_communities` DISABLE KEYS */;
INSERT INTO `users_to_communities` VALUES (1,1,1,94,'2014-10-16 18:18:57','2014-12-23 23:46:29',0,1),(2,2,3,12,'2014-11-27 20:42:11','2014-12-19 23:51:53',0,1),(4,2,1,13,'2014-11-27 21:38:30','2015-01-01 16:26:40',0,0),(5,2,6,2,'2014-12-19 23:51:31','2014-12-19 23:51:31',0,0),(6,2,11,2,'2014-12-19 23:51:36','2014-12-19 23:51:36',0,0);
/*!40000 ALTER TABLE `users_to_communities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_to_private_chats`
--

DROP TABLE IF EXISTS `users_to_private_chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_to_private_chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `entity_type` int(11) NOT NULL DEFAULT '0',
  `visible` int(11) NOT NULL DEFAULT '1',
  `minimized` int(11) NOT NULL DEFAULT '0',
  `unseen` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_to_private_chats`
--

LOCK TABLES `users_to_private_chats` WRITE;
/*!40000 ALTER TABLE `users_to_private_chats` DISABLE KEYS */;
INSERT INTO `users_to_private_chats` VALUES (1,1,1,2,0,1,0,0),(2,1,2,1,0,1,0,1),(3,2,2,3,0,0,0,0),(4,2,3,2,0,1,0,0);
/*!40000 ALTER TABLE `users_to_private_chats` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-01-03 14:30:28
