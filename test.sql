CREATE DATABASE  IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `test`;
-- MySQL dump 10.13  Distrib 5.5.38, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: test
-- ------------------------------------------------------
-- Server version	5.5.38-0ubuntu0.14.04.1

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
INSERT INTO `chats` VALUES (1,'A new test chat','Omnium',1,1,NULL,NULL,'2014-01-12 05:59:23','2014-10-09 15:23:32','open',0,0,NULL,NULL,NULL,53,1,0,0,0,0),(2,'A test chat','Omnium',1,0,'','','2014-01-12 22:02:41','2014-09-05 05:33:34','open',0,0,NULL,NULL,NULL,920,0,0,0,0,0),(3,'Testing images','Omnium',1,1,'Just a test description with some <em>markdown</em> basics in it and a link<br />\nto the author of course <a class=\'chat_link\' href=\'\\/\\/mutualcog.com/u/Omnium\'>/u/Omnium</a><br />\nwhat happens if I put another line in here? <strong>hmmmm</strong>','Just a test description with some *markdown* basics in it and a link\r\nto the author of course /p/Omnium\r\nwhat happens if I put another line in here? **hmmmm**','2014-03-10 16:28:56','2014-10-30 17:59:03','live',0,0,'http://i.imgur.com/LJ8zguP.jpg','http://i.imgur.com/LJ8zguP.jpg','i.imgur.com',294,0,0,0,0,0),(4,'Testing the advanced controls and stuff','Omnium',1,0,'Just a description <em>with</em> some markdown <a class=\'chat_link\' href=\'\\/\\/mutualcog.com/u/Omnium\'>/u/Omnium</a>','Just a description *with* some markdown /p/Omnium','2014-03-13 03:26:10','2014-10-24 06:25:40','open',100,0,NULL,NULL,NULL,20,0,0,0,0,0),(5,'Creating a static chat','Omnium',1,1,'Hello <a class=\'chat_link\' href=\'\\/\\/mutualcog.com/p/Omnium\'>@Omnium</a>','Hello @Omnium','2014-03-13 03:29:03','2014-08-05 04:46:07','open',0,0,NULL,NULL,NULL,459,1,0,0,0,0),(6,'testing static stuff','Omnium',1,1,NULL,NULL,'2014-03-13 03:37:28','2014-10-31 21:48:52','open',0,0,NULL,NULL,NULL,196,0,0,0,0,0),(8,'A second chat','Bob',4,1,'Stuff I need to look at','Stuff I need to look at','2014-04-06 20:35:38','2014-10-31 21:57:45','open',0,0,NULL,NULL,NULL,355,0,0,0,0,1),(11,'Spam and stuff','Omnium',1,1,'lots of spam','lots of spam','2014-09-03 17:50:50','2014-10-31 22:11:06','public',0,0,'http://imgur.com/gallery/jOnfC','//i.imgur.com/RVrn058.jpg?1','imgur.com',13,0,0,0,0,0),(12,'Lots and lots of philosophy','Omnium',1,1,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa<strong>aaaaaaaaaa</strong>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa**aaaaaaaaaa**aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','2014-10-16 18:07:13','2014-10-31 22:52:23','public',0,0,NULL,NULL,NULL,121,0,0,0,0,0),(13,'High level thought','Omnium',1,1,'Blah de blah de existentialism blah','Blah de blah de existentialism blah','2014-10-16 18:07:55','2014-10-16 18:24:08','public',0,0,NULL,NULL,NULL,1,0,0,0,1,0),(14,'My first post','Bob',2,1,'A post  about science and philosophy and math','A post  about science and philosophy and math','2014-10-17 19:19:26','2014-10-29 01:08:02','public',0,0,NULL,NULL,NULL,4,0,0,0,0,0),(16,'Kittens','Omnium',1,1,'cuteness','cuteness','2014-10-22 01:31:05','2014-10-22 01:31:05','public',0,0,'http://www.youtube.com/watch?v=_zqn6FtdDGc','http://localhost/laravel/YouTube-logo-full_color.png','www.youtube.com',1,0,0,0,0,0);
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
  `bond` int(11) NOT NULL DEFAULT '0',
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
INSERT INTO `interaction_users` VALUES (1,1,2,0,1,'2014-10-09 14:51:00','2014-10-09 14:51:00',55),(2,2,1,0,1,'2014-10-09 14:51:00','2014-10-09 14:51:00',65),(3,2,3,0,1,'2014-10-20 18:57:30','2014-10-20 18:58:18',100),(4,3,2,0,1,'2014-10-20 18:57:30','2014-10-20 18:58:18',150);
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
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',2,1,'2014-08-28 03:26:25','2014-08-28 03:26:25',0,0,0,0,0,'Omnium',248719806,0,0,'0.00000001',1,'public'),(2,'Also fixed',2,1,'2014-08-28 03:41:12','2014-08-28 03:41:12',0,0,0,0,0,'Omnium',248719806,0,0,'0.00000002',1,'public'),(3,'Also fixed',8,1,'2014-08-28 03:48:18','2014-08-28 03:48:18',0,0,0,0,20,'Omnium',248719806,0,0,'0.00000003',1,'public'),(4,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',8,1,'2014-08-28 03:49:11','2014-08-28 03:49:11',0,0,0,0,8,'Omnium',248719806,0,0,'0.00000004',1,'public'),(5,'Also fixed testing',8,1,'2014-08-28 04:05:47','2014-08-28 04:05:47',0,0,0,0,2,'Omnium',248719806,0,0,'0.00000005',1,'public'),(6,'Also fixed testing',2,1,'2014-08-28 04:06:01','2014-09-05 05:33:28',0,0,0,0,3,'Omnium',248719806,0,0,'0.00000006',1,'public'),(7,'Also fixed testing',2,1,'2014-08-28 04:06:09','2014-08-28 04:06:09',0,0,0,0,0,'Omnium',248719806,0,0,'0.00000007',1,'public'),(8,'testing a bunch of stuff',2,1,'2014-08-28 04:06:29','2014-08-28 04:06:29',0,0,0,0,0,'Omnium',248719806,0,0,'0.00000008',1,'public'),(9,'testin stuff',8,1,'2014-08-28 13:12:37','2014-08-28 13:12:37',0,0,0,0,0,'Omnium',19006444,0,0,'0.00000009',1,'public'),(10,'testing stuff',8,1,'2014-08-29 21:11:06','2014-08-29 21:11:06',4,4,1,1,0,'Omnium',3344622,0,0,'0.00000004.00000010',1,'public'),(11,'testing',4,1,'2014-08-30 16:41:49','2014-08-30 16:41:49',0,0,0,0,1,'Omnium',134432324,0,0,'0.00000011',1,'public'),(12,'testing more',4,1,'2014-08-30 16:41:53','2014-08-30 16:41:53',11,11,1,1,0,'Omnium',134432324,0,0,'0.00000011.00000012',1,'public'),(13,'testing',2,1,'2014-08-30 16:52:07','2014-08-30 16:52:07',6,6,1,1,0,'Omnium',134432324,0,0,'0.00000006.00000013',1,'public'),(14,'testing',8,1,'2014-09-02 22:02:21','2014-09-02 22:02:21',0,0,0,0,0,'Omnium',226339817,0,0,'0.00000014',1,'public'),(15,'moar testing',8,1,'2014-09-02 22:13:31','2014-09-02 22:13:31',0,0,0,0,1,'Omnium',226339817,0,0,'0.00000015',1,'public'),(16,'test',8,1,'2014-09-02 22:13:36','2014-09-02 22:13:36',0,0,0,0,2,'Omnium',226339817,0,0,'0.00000016',1,'public'),(17,'tester',8,1,'2014-09-02 22:13:38','2014-09-02 22:13:38',0,0,0,0,0,'Omnium',226339817,0,0,'0.00000017',1,'public'),(18,'testers',8,1,'2014-09-02 22:13:44','2014-09-02 22:13:44',0,0,0,0,0,'Omnium',226339817,0,0,'0.00000018',1,'public'),(19,'test',8,1,'2014-09-02 22:17:10','2014-09-02 22:17:10',0,0,0,0,0,'Omnium',226339817,0,0,'0.00000019',1,'public'),(20,'tests',8,1,'2014-09-02 22:17:14','2014-09-02 22:17:14',0,0,0,0,6,'Omnium',226339817,0,0,'0.00000020',1,'public'),(21,'testing',8,1,'2014-09-02 22:18:08','2014-09-02 22:18:08',0,0,0,0,3,'Omnium',226339817,0,0,'0.00000021',1,'public'),(22,'test',8,1,'2014-09-02 22:21:01','2014-09-02 22:21:01',0,0,0,0,6,'Omnium',226339817,0,0,'0.00000022',1,'public'),(23,'hello world',8,1,'2014-09-02 22:21:16','2014-09-02 22:21:16',0,0,0,0,3,'Omnium',226339817,0,0,'0.00000023',1,'public'),(24,'testing stuff',8,1,'2014-09-02 22:22:02','2014-09-02 22:22:02',0,0,0,0,8,'Omnium',226339817,0,0,'0.00000024',1,'public'),(25,'test',8,4,'2014-09-03 04:44:51','2014-09-03 04:44:51',3,3,1,1,0,'Bob',91980573,0,0,'0.00000003.00000025',1,'public'),(26,'more test',8,4,'2014-09-03 04:45:23','2014-09-03 04:45:23',22,22,1,1,0,'Bob',91980573,0,0,'0.00000022.00000026',1,'public'),(27,'well i&#39;m testing too',8,4,'2014-09-03 04:53:51','2014-09-03 04:53:51',4,4,1,2,0,'Bob',91980573,0,0,'0.00000004.00000027',1,'public'),(28,'test',8,4,'2014-09-03 04:54:17','2014-09-03 04:54:17',3,3,1,2,0,'Bob',91980573,0,0,'0.00000003.00000028',1,'public'),(29,'test',8,4,'2014-09-03 04:58:01','2014-09-03 04:58:01',24,24,1,1,0,'Bob',91980573,0,0,'0.00000024.00000029',1,'public'),(30,'testin',8,4,'2014-09-03 05:01:59','2014-09-03 05:01:59',3,3,1,3,0,'Bob',91980573,0,0,'0.00000003.00000030',1,'public'),(31,'more test?',8,4,'2014-09-03 05:02:38','2014-09-03 05:02:38',3,3,1,4,0,'Bob',91980573,0,0,'0.00000003.00000031',1,'public'),(32,'test',8,4,'2014-09-03 05:02:55','2014-09-03 05:02:55',3,3,1,5,0,'Bob',91980573,0,0,'0.00000003.00000032',1,'public'),(33,'test again',8,4,'2014-09-03 05:03:09','2014-09-03 05:03:09',3,3,1,6,0,'Bob',91980573,0,0,'0.00000003.00000033',1,'public'),(34,'test',8,4,'2014-09-03 05:03:40','2014-09-03 05:03:40',4,4,1,3,0,'Bob',91980573,0,0,'0.00000004.00000034',1,'public'),(35,'test',8,4,'2014-09-03 05:07:41','2014-09-03 05:07:41',24,24,1,2,0,'Bob',91980573,0,0,'0.00000024.00000035',1,'public'),(36,'test',8,4,'2014-09-03 05:08:05','2014-09-03 05:08:05',24,24,1,3,0,'Bob',91980573,0,0,'0.00000024.00000036',1,'public'),(37,'test',8,4,'2014-09-03 05:13:00','2014-09-03 05:13:00',3,3,1,7,0,'Bob',91980573,0,0,'0.00000003.00000037',1,'public'),(38,'test',8,4,'2014-09-03 05:13:06','2014-09-03 05:13:06',5,5,1,1,0,'Bob',91980573,0,0,'0.00000005.00000038',1,'public'),(39,'tester',8,4,'2014-09-03 05:14:54','2014-09-03 05:14:54',3,3,1,8,0,'Bob',91980573,0,0,'0.00000003.00000039',1,'public'),(40,'tests',8,4,'2014-09-03 05:15:40','2014-09-03 05:15:40',3,3,1,9,0,'Bob',91980573,0,0,'0.00000003.00000040',1,'public'),(41,'test',8,4,'2014-09-03 05:25:17','2014-09-03 05:25:17',3,3,1,10,0,'Bob',91980573,0,0,'0.00000003.00000041',1,'public'),(42,'test',8,4,'2014-09-03 05:26:13','2014-09-03 05:26:13',3,3,1,11,0,'Bob',91980573,0,0,'0.00000003.00000042',1,'public'),(43,'test',8,4,'2014-09-03 05:27:25','2014-09-03 05:27:25',3,3,1,12,0,'Bob',91980573,0,0,'0.00000003.00000043',1,'public'),(44,'test',8,4,'2014-09-03 05:29:28','2014-09-03 05:29:28',3,3,1,13,0,'Bob',91980573,0,0,'0.00000003.00000044',1,'public'),(45,'test',8,4,'2014-09-03 05:31:45','2014-09-03 05:31:45',20,20,1,1,0,'Bob',91980573,0,0,'0.00000020.00000045',1,'public'),(46,'teste',8,4,'2014-09-03 05:32:01','2014-09-03 05:32:01',20,20,1,2,0,'Bob',91980573,0,0,'0.00000020.00000046',1,'public'),(47,'tests',8,4,'2014-09-03 05:32:23','2014-09-03 05:32:23',20,20,1,3,0,'Bob',91980573,0,0,'0.00000020.00000047',1,'public'),(48,'test',8,4,'2014-09-03 17:05:38','2014-09-03 17:05:38',4,4,1,4,0,'Bob',217456468,0,0,'0.00000004.00000048',1,'public'),(49,'test',8,4,'2014-09-03 17:05:54','2014-09-03 17:05:54',4,4,1,5,0,'Bob',217456468,0,0,'0.00000004.00000049',1,'public'),(50,'test',8,4,'2014-09-03 17:06:04','2014-09-03 17:06:04',4,4,1,6,0,'Bob',217456468,0,0,'0.00000004.00000050',1,'public'),(51,'testing',8,4,'2014-09-03 17:06:30','2014-09-03 17:06:30',20,20,1,4,0,'Bob',217456468,0,0,'0.00000020.00000051',1,'public'),(52,'tests',8,4,'2014-09-03 17:06:42','2014-09-03 17:06:42',22,22,1,2,0,'Bob',217456468,0,0,'0.00000022.00000052',1,'public'),(53,'tests',8,4,'2014-09-03 17:06:53','2014-09-03 17:06:53',22,22,1,3,0,'Bob',217456468,0,0,'0.00000022.00000053',1,'public'),(54,'tester',8,4,'2014-09-03 17:07:05','2014-09-03 17:07:05',22,22,1,4,0,'Bob',217456468,0,0,'0.00000022.00000054',1,'public'),(55,'tes',8,4,'2014-09-03 17:07:32','2014-09-03 17:07:32',22,22,1,5,0,'Bob',217456468,0,0,'0.00000022.00000055',1,'public'),(56,'tests',8,4,'2014-09-03 17:07:42','2014-09-03 17:07:42',22,22,1,6,0,'Bob',217456468,0,0,'0.00000022.00000056',1,'public'),(57,'teste',8,4,'2014-09-03 17:07:59','2014-09-03 17:07:59',24,24,1,4,0,'Bob',217456468,0,0,'0.00000024.00000057',1,'public'),(58,'test',8,4,'2014-09-03 17:08:11','2014-09-03 17:08:11',24,24,1,5,0,'Bob',217456468,0,0,'0.00000024.00000058',1,'public'),(59,'tests',8,4,'2014-09-03 17:08:32','2014-09-03 17:08:32',24,24,1,6,0,'Bob',217456468,0,0,'0.00000024.00000059',1,'public'),(60,'test',8,4,'2014-09-03 17:08:54','2014-09-03 17:08:54',24,24,1,7,0,'Bob',217456468,0,0,'0.00000024.00000060',1,'public'),(61,'tes',8,4,'2014-09-03 17:09:12','2014-09-03 17:09:12',24,24,1,8,0,'Bob',217456468,0,0,'0.00000024.00000061',1,'public'),(62,'test',8,4,'2014-09-03 17:09:28','2014-09-03 17:09:28',23,23,1,1,0,'Bob',217456468,0,0,'0.00000023.00000062',1,'public'),(63,'test',8,4,'2014-09-03 17:12:20','2014-09-03 17:12:20',23,23,1,2,0,'Bob',217456468,0,0,'0.00000023.00000063',1,'public'),(64,'test',8,4,'2014-09-03 17:12:35','2014-09-03 17:12:35',23,23,1,3,0,'Bob',217456468,0,0,'0.00000023.00000064',1,'public'),(65,'test',8,4,'2014-09-03 17:13:04','2014-09-03 17:13:04',21,21,1,1,0,'Bob',217456468,0,0,'0.00000021.00000065',1,'public'),(66,'test',8,4,'2014-09-03 17:14:17','2014-09-03 17:14:17',21,21,1,2,0,'Bob',217456468,0,0,'0.00000021.00000066',1,'public'),(67,'test',8,4,'2014-09-03 17:15:53','2014-09-03 17:15:53',21,21,1,3,0,'Bob',217456468,0,0,'0.00000021.00000067',1,'public'),(68,'test',8,4,'2014-09-03 17:19:00','2014-09-03 17:19:00',4,4,1,7,0,'Bob',217456468,0,0,'0.00000004.00000068',1,'public'),(69,'test',8,4,'2014-09-03 17:19:23','2014-09-03 17:19:23',20,20,1,5,0,'Bob',217456468,0,0,'0.00000020.00000069',1,'public'),(70,'rwar',8,4,'2014-09-03 17:19:51','2014-09-03 17:19:51',16,16,1,1,0,'Bob',217456468,0,0,'0.00000016.00000070',1,'public'),(71,'test',8,4,'2014-09-03 17:20:03','2014-09-03 17:20:03',16,16,1,2,0,'Bob',217456468,0,0,'0.00000016.00000071',1,'public'),(72,'test',8,4,'2014-09-03 17:20:40','2014-09-03 17:20:40',3,3,1,14,0,'Bob',217456468,0,0,'0.00000003.00000072',1,'public'),(73,'test',8,4,'2014-09-03 17:21:53','2014-09-03 17:21:53',3,3,1,15,0,'Bob',217456468,0,0,'0.00000003.00000073',1,'public'),(74,'rwar',8,4,'2014-09-03 17:22:13','2014-09-03 17:22:13',4,4,1,8,0,'Bob',217456468,0,0,'0.00000004.00000074',1,'public'),(75,'test',8,4,'2014-09-03 17:23:42','2014-09-03 17:23:42',15,15,1,1,0,'Bob',217456468,0,0,'0.00000015.00000075',1,'public'),(76,'test',8,4,'2014-09-03 17:24:13','2014-09-03 17:24:13',3,3,1,16,0,'Bob',217456468,0,0,'0.00000003.00000076',1,'public'),(77,'test',8,4,'2014-09-03 17:25:18','2014-09-03 17:25:18',3,3,1,17,0,'Bob',217456468,0,0,'0.00000003.00000077',1,'public'),(78,'rawr',8,4,'2014-09-03 17:25:32','2014-09-03 17:25:32',5,5,1,2,0,'Bob',217456468,0,0,'0.00000005.00000078',1,'public'),(79,'ragra',8,4,'2014-09-03 17:25:48','2014-09-03 17:25:48',20,20,1,6,0,'Bob',217456468,0,0,'0.00000020.00000079',1,'public'),(80,'test',8,4,'2014-09-05 05:18:22','2014-09-05 05:18:22',3,3,1,18,0,'Bob',109914338,0,0,'0.00000003.00000080',1,'public'),(81,'test',8,4,'2014-09-05 05:24:46','2014-09-05 05:24:46',3,3,1,19,0,'Bob',109914338,0,0,'0.00000003.00000081',1,'public'),(82,'test',8,4,'2014-09-05 05:30:21','2014-09-05 05:30:21',3,3,1,20,0,'Bob',109914338,0,0,'0.00000003.00000082',1,'public'),(83,'testing stuff',2,4,'2014-09-05 05:31:54','2014-09-05 05:31:54',6,6,1,2,0,'Bob',109914338,0,0,'0.00000006.00000083',1,'public'),(84,'more testing',2,1,'2014-09-05 05:33:28','2014-09-05 05:33:28',6,6,1,3,0,'Omnium',109914338,0,0,'0.00000006.00000084',1,'public'),(85,'test',8,1,'2014-09-05 05:37:26','2014-09-05 05:37:26',0,0,0,0,0,'Omnium',109914338,0,0,'0.00000085',1,'public'),(86,'<strong>test</strong>',11,1,'2014-10-15 19:14:51','2014-10-15 19:14:51',0,0,0,0,0,'Omnium',233273243,0,0,'0.00000086',1,'public'),(87,'<strong>test</strong>',11,1,'2014-10-15 19:46:27','2014-10-15 19:46:27',0,0,0,0,0,'Omnium',233273243,0,0,'0.00000087',1,'public'),(88,'<strong>test</strong>',11,1,'2014-10-15 19:47:50','2014-10-15 19:47:50',0,0,0,0,0,'Omnium',233273243,0,0,'0.00000088',1,'public'),(89,'gotta test em all',8,1,'2014-10-21 19:48:28','2014-10-21 19:48:35',0,0,0,0,0,'Omnium',215987767,1,0,'0.00000089',1,'public'),(90,'testing <strong>markdown</strong> and <a class=\'chat_link\' href=\'//mutualcog.com/c/testing\'>/c/testing</a>',8,1,'2014-10-21 19:51:14','2014-10-21 19:51:14',0,0,0,0,0,'Omnium',215987767,0,0,'0.00000090',1,'public'),(91,'do <a class=\'chat_link\' href=\'//mutualcog.com/c/testing\'>#testing</a> hastags work?',8,1,'2014-10-21 19:51:28','2014-10-21 19:51:28',0,0,0,0,0,'Omnium',215987767,0,0,'0.00000091',1,'public'),(92,'test',12,1,'2014-10-29 01:26:08','2014-10-29 01:31:11',0,0,0,0,3,'Omnium',14460750,0,0,'0.00000092',1,'public'),(93,'we must',12,23,'2014-10-31 22:11:32','2014-10-31 22:11:32',92,92,1,1,0,'77770207',77770207,0,0,'0.00000092.00000093',1,'public'),(94,'add layers',12,23,'2014-10-31 22:11:35','2014-10-31 22:11:35',92,92,1,2,0,'77770207',77770207,0,0,'0.00000092.00000094',1,'public'),(95,'for the purposes',12,23,'2014-10-31 22:11:39','2014-10-31 22:11:39',92,92,1,3,1,'77770207',77770207,0,0,'0.00000092.00000095',1,'public'),(96,'<em>This message has been deleted</em>',12,23,'2014-10-31 22:11:44','2014-10-31 22:11:44',95,92,2,1,0,'77770207',77770207,0,0,'0.00000092.00000095.00000096',1,'public'),(97,'this is most aggreeable',12,23,'2014-10-31 22:12:51','2014-10-31 22:12:51',0,0,0,0,0,'77770207',77770207,0,0,'0.00000097',1,'public');
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
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages_voted`
--

LOCK TABLES `messages_voted` WRITE;
/*!40000 ALTER TABLE `messages_voted` DISABLE KEYS */;
INSERT INTO `messages_voted` VALUES (1,21,1,1,'2014-08-28 01:37:16','2014-08-28 01:37:16'),(2,22,1,1,'2014-08-28 01:37:32','2014-08-28 01:37:32'),(3,23,1,1,NULL,NULL),(4,24,1,1,NULL,NULL),(5,25,1,1,NULL,NULL),(6,26,1,1,NULL,NULL),(7,27,1,1,NULL,NULL),(8,28,1,1,NULL,NULL),(9,29,1,1,NULL,NULL),(10,30,1,1,NULL,NULL),(11,31,1,1,'2014-08-28 02:45:09','2014-08-28 02:45:09'),(12,32,1,1,'2014-08-28 02:45:45','2014-08-28 02:45:45'),(13,33,1,1,'2014-08-28 02:51:02','2014-08-28 02:51:02'),(14,34,1,1,NULL,NULL),(15,35,1,1,NULL,NULL),(16,36,1,1,'2014-08-28 03:13:04','2014-08-28 03:13:04'),(17,37,1,1,'2014-08-28 03:25:36','2014-08-28 03:25:36'),(18,1,1,1,'2014-08-28 03:26:25','2014-08-28 03:26:25'),(19,2,1,1,'2014-08-28 03:41:12','2014-08-28 03:41:12'),(20,3,1,1,NULL,NULL),(21,4,1,1,NULL,NULL),(22,5,1,1,NULL,NULL),(23,6,1,1,'2014-08-28 04:06:01','2014-08-28 04:06:01'),(24,7,1,1,'2014-08-28 04:06:09','2014-08-28 04:06:09'),(25,8,1,1,'2014-08-28 04:06:29','2014-08-28 04:06:29'),(26,9,1,1,NULL,NULL),(27,10,1,1,NULL,NULL),(28,11,1,1,NULL,NULL),(29,12,1,1,NULL,NULL),(30,13,1,1,'2014-08-30 16:52:07','2014-08-30 16:52:07'),(31,14,1,1,NULL,NULL),(32,15,1,1,NULL,NULL),(33,16,1,1,NULL,NULL),(34,17,1,1,NULL,NULL),(35,18,1,1,NULL,NULL),(36,19,1,1,NULL,NULL),(37,20,1,1,NULL,NULL),(38,21,1,1,NULL,NULL),(39,22,1,1,NULL,NULL),(40,23,1,1,NULL,NULL),(41,24,1,1,NULL,NULL),(42,25,4,1,NULL,NULL),(43,26,4,1,NULL,NULL),(44,27,4,1,NULL,NULL),(45,28,4,1,NULL,NULL),(46,29,4,1,NULL,NULL),(47,30,4,1,NULL,NULL),(48,31,4,1,NULL,NULL),(49,32,4,1,NULL,NULL),(50,33,4,1,NULL,NULL),(51,34,4,1,NULL,NULL),(52,35,4,1,NULL,NULL),(53,36,4,1,NULL,NULL),(54,37,4,1,NULL,NULL),(55,38,4,1,NULL,NULL),(56,39,4,1,NULL,NULL),(57,40,4,1,NULL,NULL),(58,41,4,1,NULL,NULL),(59,42,4,1,NULL,NULL),(60,43,4,1,NULL,NULL),(61,44,4,1,NULL,NULL),(62,45,4,1,NULL,NULL),(63,46,4,1,NULL,NULL),(64,47,4,1,NULL,NULL),(65,48,4,1,NULL,NULL),(66,49,4,1,NULL,NULL),(67,50,4,1,NULL,NULL),(68,51,4,1,NULL,NULL),(69,52,4,1,NULL,NULL),(70,53,4,1,NULL,NULL),(71,54,4,1,NULL,NULL),(72,55,4,1,NULL,NULL),(73,56,4,1,NULL,NULL),(74,57,4,1,NULL,NULL),(75,58,4,1,NULL,NULL),(76,59,4,1,NULL,NULL),(77,60,4,1,NULL,NULL),(78,61,4,1,NULL,NULL),(79,62,4,1,NULL,NULL),(80,63,4,1,NULL,NULL),(81,64,4,1,NULL,NULL),(82,65,4,1,NULL,NULL),(83,66,4,1,NULL,NULL),(84,67,4,1,NULL,NULL),(85,68,4,1,NULL,NULL),(86,69,4,1,NULL,NULL),(87,70,4,1,NULL,NULL),(88,71,4,1,NULL,NULL),(89,72,4,1,NULL,NULL),(90,73,4,1,NULL,NULL),(91,74,4,1,NULL,NULL),(92,75,4,1,NULL,NULL),(93,76,4,1,NULL,NULL),(94,77,4,1,NULL,NULL),(95,78,4,1,NULL,NULL),(96,79,4,1,NULL,NULL),(97,80,4,1,NULL,NULL),(98,81,4,1,NULL,NULL),(99,82,4,1,NULL,NULL),(100,83,4,1,'2014-09-05 05:31:54','2014-09-05 05:31:54'),(101,84,1,1,'2014-09-05 05:33:28','2014-09-05 05:33:28'),(102,85,1,1,NULL,NULL),(103,86,1,1,NULL,NULL),(104,87,1,1,NULL,NULL),(105,88,1,1,NULL,NULL),(106,89,1,1,'2014-10-21 19:48:33','2014-10-21 19:48:35'),(107,92,1,1,NULL,'2014-10-29 01:31:11');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `node_auth`
--

LOCK TABLES `node_auth` WRITE;
/*!40000 ALTER TABLE `node_auth` DISABLE KEYS */;
INSERT INTO `node_auth` VALUES (1,1,'Omnium','44330829',24,'c258310b779e6f00c530db69189ee6965774b8bf',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (2,'2014-10-20 18:57:30','2014-10-20 18:57:30',3,2,NULL,'<div class=\'request_cont\'><div class=\'request_text\'><a class=\'chat_link\' href=\'//mutualcog.com/u/2\'>Bob</a> has accepted your friend request</div><div class=\'request_text\'><a class=\'chat_link\' href=\'//mutualcog.com/profile/dismiss/2\'>Dismiss</a></div></div>',0,2,'Bob',0);
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
INSERT INTO `private_chats` VALUES (1,NULL,'2014-10-09 14:51:05','2014-10-09 14:51:05',0,2,1),(2,NULL,'2014-10-09 18:25:19','2014-10-20 18:58:18',1,2,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `private_messages`
--

LOCK TABLES `private_messages` WRITE;
/*!40000 ALTER TABLE `private_messages` DISABLE KEYS */;
INSERT INTO `private_messages` VALUES (1,'test',1,'Omnium',1,'2014-10-15 19:26:11','2014-10-15 19:26:11'),(2,'got',1,'Bob',2,'2014-10-20 18:59:46','2014-10-20 18:59:46'),(3,'to',1,'Bob',2,'2014-10-20 18:59:48','2014-10-20 18:59:48'),(4,'get',1,'Bob',2,'2014-10-20 18:59:49','2014-10-20 18:59:49'),(5,'a',1,'Bob',2,'2014-10-20 18:59:49','2014-10-20 18:59:49'),(6,'scroll',1,'Bob',2,'2014-10-20 18:59:51','2014-10-20 18:59:51'),(7,'bar',1,'Bob',2,'2014-10-20 18:59:52','2014-10-20 18:59:52'),(8,'in',1,'Bob',2,'2014-10-20 18:59:52','2014-10-20 18:59:52'),(9,'here',1,'Bob',2,'2014-10-20 18:59:55','2014-10-20 18:59:55'),(10,'heyo',1,'Omnium',1,'2014-10-21 19:48:15','2014-10-21 19:48:15');
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serials`
--

LOCK TABLES `serials` WRITE;
/*!40000 ALTER TABLE `serials` DISABLE KEYS */;
INSERT INTO `serials` VALUES (1,36935098,'2014-10-22 21:15:00','2014-10-22 21:15:00','0','127.0.0.1',0),(2,12875440,'2014-10-23 05:10:40','2014-10-23 05:10:40','0','127.0.0.1',0),(3,21950923,'2014-10-23 05:10:40','2014-10-23 05:10:40','0','127.0.0.1',0),(4,192125939,'2014-10-23 18:00:54','2014-10-23 18:00:54','0','127.0.0.1',0),(5,204931268,'2014-10-24 05:49:30','2014-10-24 05:49:30','0','127.0.0.1',0),(6,28510819,'2014-10-24 05:49:32','2014-10-24 05:49:32','0','127.0.0.1',0),(7,243053310,'2014-10-24 05:49:34','2014-10-24 05:49:34','0','127.0.0.1',0),(8,20578265,'2014-10-24 15:59:30','2014-10-24 15:59:30','0','127.0.0.1',0),(9,89054312,'2014-10-24 15:59:31','2014-10-24 15:59:31','0','127.0.0.1',0),(10,101508179,'2014-10-24 15:59:31','2014-10-24 15:59:31','0','127.0.0.1',0),(11,14773650,'2014-10-24 15:59:33','2014-10-24 15:59:33','0','127.0.0.1',0),(12,251181042,'2014-10-29 00:44:11','2014-10-29 00:44:11','0','127.0.0.1',0),(13,14460750,'2014-10-29 00:44:12','2014-10-29 01:26:08','0','127.0.0.1',0),(14,148206314,'2014-10-29 19:05:20','2014-10-29 19:05:20','0','127.0.0.1',0),(15,95481405,'2014-10-29 19:05:20','2014-10-29 19:05:20','0','127.0.0.1',0),(16,96413700,'2014-10-29 19:05:22','2014-10-29 19:06:10','2014-10-29T19:06:10+00:00','127.0.0.1',0),(17,199472310,'2014-10-30 14:32:44','2014-10-30 14:32:44','0','127.0.0.1',0),(18,37272218,'2014-10-30 14:32:44','2014-10-30 14:32:44','0','127.0.0.1',0),(19,135333993,'2014-10-30 17:35:06','2014-10-30 17:35:06','0','127.0.0.1',0),(20,152940448,'2014-10-30 17:35:06','2014-10-30 17:35:06','0','127.0.0.1',0),(21,18462155,'2014-10-30 17:35:06','2014-10-30 17:35:06','0','127.0.0.1',0),(22,217616049,'2014-10-30 17:35:06','2014-10-30 17:35:06','0','127.0.0.1',0),(23,77770207,'2014-10-31 21:46:13','2014-10-31 22:12:51','0','127.0.0.1',0),(24,44330829,'2014-11-08 05:36:56','2014-11-08 05:36:56','0','127.0.0.1',0);
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
  PRIMARY KEY (`id`),
  KEY `name` (`name`,`level`,`is_admin`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2014-10-09 14:47:29','2014-11-08 07:29:39','Omnium','eyJpdiI6IndPMUExaVc1am1QVWh6RERrQmJaTkpJTnhCY1dLVXRBMnR6TUtPcUlEbXM9IiwidmFsdWUiOiJrNFpGanFHZ21YTUcyMVhxUmpGdW1XeUk5V1NYNlwvb2srdFBMd3NxbXFHVT0iLCJtYWMiOiJiNzZmOWNjMDUyOTUwNzBlNjFkOTBkN2Y1MWE4YzY1YjJkODY4NDUwNjc2NzIxZDFiYTNmMTBmMzAzMzA3NzE0In0=',NULL,24,1,1,0,120,'2014-11-08 05:55:10',1,'testing',0,0,1,0,'2014-11-08 07:21:12',0,'127.0.0.1',0,1,'DyU6gG64eTfI5S3J1sHdk9TT0cAyH7pB5BPp1StOyDQrQ8xZqsbLXu8vQd74'),(2,'2014-10-09 14:50:28','2014-10-24 06:01:26','Bob','eyJpdiI6ImtuK1ZYWWs1TnBxNExodHkrUkNwXC90bytoNzNyNGtNMXZLalNmNlljQldJPSIsInZhbHVlIjoiaHpWUk1CQk5maGs0OFc3MjZWSVBJSVlqRVJyUEg1cDVjMEtSSzRhRnJKbz0iLCJtYWMiOiJiNTU4YzY4MzIzZGE3MzcwYjIxNmQxYmU5MDU5ZjM4Y2RmZDU4ZmE4MGQyOGUwYzFjNDJmN2ZhYmVhMjI1MjRiIn0=',NULL,7,0,0,0,120,'2014-10-23 18:33:48',0,'testing',0,0,1,0,'2014-10-23 18:45:24',0,'127.0.0.1',0,0,'qSfqpVUzKgCqCzgFGolAq48g0YYmTJupgmi7w6wtj9hPFXgPJs00dmvvz0k3'),(3,'2014-10-09 18:24:23','2014-10-20 18:57:18','Test','eyJpdiI6IjVrTTB2blA0SGs4azI0ZEhPUEdlUEZFWjhcLzdcL2Qzc1lldzBKakFWMG4wWT0iLCJ2YWx1ZSI6IkhDTkxQNVhJYWZwK0ZZNWMwblRMR0xmWE1xd29CcUR0YVZnbEZsK25pbm89IiwibWFjIjoiOWE2OTlhODhlODZiNWRhNDgzNDAzOWRiODMxOTlkNTk4OWQ0ZjU2MmU1NzY2NGQ3N2I2ODQzNTY5NmQ3OGM5YiJ9',NULL,346,0,0,0,120,'2014-10-20 18:57:04',0,'home',0,0,1,0,'2014-10-20 18:57:18',0,'127.0.0.1',0,0,'9B4nj9HXgd55TX9yqzF61ZKYfdT96scexF4yRAPclAdojeh811tnTkcQlvnP');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
  PRIMARY KEY (`id`),
  KEY `chat_id` (`chat_id`,`user_id`),
  KEY `author` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_to_chats`
--

LOCK TABLES `users_to_chats` WRITE;
/*!40000 ALTER TABLE `users_to_chats` DISABLE KEYS */;
INSERT INTO `users_to_chats` VALUES (1,8,1,0,0,'Omnium',0,0),(2,5,1,0,1,'Omnium',0,0),(3,8,155,0,0,'137880073',1,0),(4,8,4,0,1,'Bob',0,0),(5,8,156,0,0,'169693618',1,0),(6,8,161,0,0,'145867030',1,0),(7,8,162,0,0,'104808579',0,0),(8,8,163,0,0,'116236217',0,0),(9,8,164,0,0,'38816918',1,0),(10,8,167,0,0,'216684825',0,0),(11,5,174,0,0,'100288325',0,0),(12,8,190,0,0,'47903202',1,0),(13,8,192,0,0,'153251245',1,0),(14,8,193,0,0,'97168747',1,0),(15,8,195,0,0,'114919667',0,0),(16,7,199,0,0,'117667229',0,0),(17,6,1,0,1,'Omnium',0,0),(18,6,205,0,0,'224785232',0,0),(19,6,206,0,0,'24282545',0,0),(20,8,213,0,0,'31541016',0,0),(21,8,214,0,0,'260324891',0,0),(22,6,214,0,0,'260324891',0,0),(23,6,216,0,0,'125063196',0,0),(24,6,218,0,0,'69574714',0,0),(25,7,220,0,0,'164434223',0,0),(26,6,220,0,0,'164434223',0,0),(27,8,220,0,0,'164434223',0,0),(28,8,229,0,0,'66840329',0,0),(29,3,230,0,0,'186748993',0,0),(30,3,1,0,1,'Omnium',0,0),(31,3,231,0,0,'56770169',0,0),(32,6,234,0,0,'205801104',0,0),(33,6,4,0,0,'Bob',0,0),(34,8,242,0,0,'72100981',0,0),(35,3,242,0,0,'72100981',0,0),(36,3,4,0,0,'Bob',0,0),(37,8,244,0,0,'18716786',0,0),(38,8,248,0,0,'79472836',0,0),(39,1,1,0,1,'Omnium',0,0),(40,9,1,0,1,'Omnium',0,0),(41,8,255,0,0,'212602908',0,0),(42,2,257,0,0,'248719806',0,0),(43,2,1,0,1,'Omnium',0,0),(44,4,1,0,1,'Omnium',0,0),(45,8,259,0,0,'258531251',1,0),(46,2,260,0,0,'221039896',0,0),(47,8,264,0,0,'93703686',0,0),(48,2,267,0,0,'256498014',0,0),(49,2,268,0,0,'210036155',0,0),(50,2,271,0,0,'257660330',0,0),(51,8,270,0,0,'91980573',0,0),(52,8,272,0,0,'11467940',0,0),(53,8,273,0,0,'217456468',0,0),(54,10,1,0,1,'Omnium',0,0),(55,11,1,0,1,'Omnium',1,0),(56,2,277,0,0,'109914338',0,0),(57,8,277,0,0,'109914338',0,0),(58,2,4,0,0,'Bob',0,0),(59,8,278,0,0,'200184971',1,0),(60,8,280,0,0,'252429921',1,0),(61,8,294,0,0,'103912879',0,0),(62,1,2,0,0,'Bob',0,0),(63,4,301,0,0,'252678899',0,0),(64,8,322,0,0,'165497611',0,0),(65,11,324,0,0,'233273243',0,0),(66,12,1,0,1,'Omnium',0,0),(67,13,1,0,1,'Omnium',1,0),(68,14,2,0,1,'Bob',0,0),(69,8,2,0,0,'Bob',0,0),(70,4,2,0,0,'Bob',0,0),(71,15,1,0,1,'Omnium',0,0),(72,16,1,0,1,'Omnium',0,0),(73,14,1,0,0,'Omnium',0,0),(74,8,4,0,1,'192125939',0,0),(75,4,4,0,0,'192125939',0,0),(76,14,13,0,0,'14460750',0,0),(77,12,13,0,0,'14460750',0,0),(78,17,1,0,1,'Omnium',0,0),(79,6,23,0,0,'77770207',0,0),(80,8,23,0,0,'77770207',0,0),(81,11,23,0,0,'77770207',0,0),(82,12,23,0,0,'77770207',0,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_to_communities`
--

LOCK TABLES `users_to_communities` WRITE;
/*!40000 ALTER TABLE `users_to_communities` DISABLE KEYS */;
INSERT INTO `users_to_communities` VALUES (1,1,1,88,'2014-10-16 18:18:57','2014-11-08 07:21:11',0,1);
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
INSERT INTO `users_to_private_chats` VALUES (1,1,1,2,0,2,0,0),(2,1,2,1,0,1,0,0),(3,2,2,3,0,0,0,0),(4,2,3,2,0,1,0,0);
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

-- Dump completed on 2014-11-08  1:43:02
