/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: theatre_booking_db
-- ------------------------------------------------------
-- Server version	12.2.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `reservation_seats`
--

DROP TABLE IF EXISTS `reservation_seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation_seats` (
  `reservation_id` int(11) NOT NULL,
  `seat_id` int(11) NOT NULL,
  PRIMARY KEY (`reservation_id`,`seat_id`),
  KEY `seat_id` (`seat_id`),
  CONSTRAINT `1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`),
  CONSTRAINT `2` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`seat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation_seats`
--

LOCK TABLES `reservation_seats` WRITE;
/*!40000 ALTER TABLE `reservation_seats` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation_seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `showtime_id` int(11) NOT NULL,
  `status` varchar(30) DEFAULT 'active',
  `total_price` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`reservation_id`),
  KEY `user_id` (`user_id`),
  KEY `showtime_id` (`showtime_id`),
  CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `2` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`showtime_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES
(1,1,1,'cancelled',18.00,'2026-05-20 13:24:12'),
(2,1,1,'cancelled',18.00,'2026-05-20 13:25:37'),
(3,1,1,'cancelled',18.00,'2026-05-20 13:26:05'),
(4,1,2,'cancelled',18.00,'2026-05-20 16:28:44'),
(5,1,5,'cancelled',10.00,'2026-05-20 16:28:48'),
(6,1,5,'cancelled',10.00,'2026-05-20 16:28:48'),
(7,1,5,'cancelled',10.00,'2026-05-20 16:28:48'),
(8,1,5,'cancelled',10.00,'2026-05-20 16:28:48'),
(9,1,5,'cancelled',10.00,'2026-05-20 16:28:49'),
(10,1,5,'cancelled',10.00,'2026-05-20 16:28:49'),
(11,1,5,'cancelled',10.00,'2026-05-20 16:28:49'),
(12,1,5,'cancelled',10.00,'2026-05-20 16:28:49'),
(13,1,5,'cancelled',10.00,'2026-05-20 16:28:49'),
(14,1,5,'cancelled',10.00,'2026-05-20 16:28:49'),
(15,1,1,'cancelled',18.00,'2026-05-20 16:34:10'),
(16,1,1,'cancelled',18.00,'2026-05-20 16:34:11'),
(17,1,1,'cancelled',18.00,'2026-05-20 16:34:11'),
(18,1,1,'cancelled',18.00,'2026-05-20 16:36:13'),
(19,1,1,'cancelled',18.00,'2026-05-20 16:36:15'),
(20,1,1,'cancelled',18.00,'2026-05-20 16:36:16'),
(21,1,1,'cancelled',18.00,'2026-05-20 16:36:18'),
(22,1,1,'cancelled',18.00,'2026-05-20 16:41:45'),
(23,1,1,'cancelled',18.00,'2026-05-20 16:41:47'),
(24,1,1,'cancelled',18.00,'2026-05-20 17:18:07'),
(25,1,1,'cancelled',18.00,'2026-05-20 17:18:15'),
(26,3,1,'active',18.00,'2026-05-21 23:32:43'),
(27,3,1,'active',18.00,'2026-05-21 23:32:45'),
(28,3,2,'active',18.00,'2026-05-21 23:32:47'),
(29,1,1,'cancelled',18.00,'2026-05-21 23:32:57'),
(30,1,4,'cancelled',14.00,'2026-05-21 23:34:39'),
(31,1,4,'cancelled',14.00,'2026-05-21 23:34:39'),
(32,1,4,'cancelled',14.00,'2026-05-21 23:34:39'),
(33,1,4,'cancelled',14.00,'2026-05-21 23:34:40'),
(34,1,1,'cancelled',18.00,'2026-05-28 00:32:23'),
(35,1,1,'cancelled',18.00,'2026-05-28 00:32:26'),
(36,1,1,'active',18.00,'2026-05-28 00:32:29');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `seat_id` int(11) NOT NULL AUTO_INCREMENT,
  `showtime_id` int(11) NOT NULL,
  `seat_row` varchar(10) NOT NULL,
  `seat_number` int(11) NOT NULL,
  `category` varchar(50) DEFAULT 'standard',
  `is_reserved` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`seat_id`),
  UNIQUE KEY `showtime_id` (`showtime_id`,`seat_row`,`seat_number`),
  CONSTRAINT `1` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`showtime_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shows`
--

DROP TABLE IF EXISTS `shows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `shows` (
  `show_id` int(11) NOT NULL AUTO_INCREMENT,
  `theatre_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `age_rating` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`show_id`),
  KEY `theatre_id` (`theatre_id`),
  CONSTRAINT `1` FOREIGN KEY (`theatre_id`) REFERENCES `theatres` (`theatre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shows`
--

LOCK TABLES `shows` WRITE;
/*!40000 ALTER TABLE `shows` DISABLE KEYS */;
INSERT INTO `shows` VALUES
(1,1,'Άμλετ','Κλασική τραγωδία του Σαίξπηρ.',150,'12+'),
(2,1,'Οιδίπους Τύραννος','Αρχαία ελληνική τραγωδία.',120,'12+'),
(3,2,'Η Αυλή των Θαυμάτων','Ελληνικό θεατρικό έργο.',110,'All'),
(4,3,'Παιδική Παράσταση: Το Μαγικό Δάσος','Παιδική θεατρική παράσταση.',80,'All');
/*!40000 ALTER TABLE `shows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `showtimes`
--

DROP TABLE IF EXISTS `showtimes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `showtimes` (
  `showtime_id` int(11) NOT NULL AUTO_INCREMENT,
  `show_id` int(11) NOT NULL,
  `show_date` date NOT NULL,
  `show_time` time NOT NULL,
  `hall` varchar(100) DEFAULT NULL,
  `base_price` decimal(8,2) NOT NULL,
  PRIMARY KEY (`showtime_id`),
  KEY `show_id` (`show_id`),
  CONSTRAINT `1` FOREIGN KEY (`show_id`) REFERENCES `shows` (`show_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `showtimes`
--

LOCK TABLES `showtimes` WRITE;
/*!40000 ALTER TABLE `showtimes` DISABLE KEYS */;
INSERT INTO `showtimes` VALUES
(1,1,'2026-06-10','20:30:00','Κεντρική Σκηνή',18.00),
(2,1,'2026-06-11','20:30:00','Κεντρική Σκηνή',18.00),
(3,2,'2026-06-12','21:00:00','Αίθουσα Α',15.00),
(4,3,'2026-06-13','19:30:00','Σκηνή 1',14.00),
(5,4,'2026-06-14','18:00:00','Παιδική Σκηνή',10.00);
/*!40000 ALTER TABLE `showtimes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theatres`
--

DROP TABLE IF EXISTS `theatres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `theatres` (
  `theatre_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `location` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`theatre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theatres`
--

LOCK TABLES `theatres` WRITE;
/*!40000 ALTER TABLE `theatres` DISABLE KEYS */;
INSERT INTO `theatres` VALUES
(1,'Εθνικό Θέατρο','Αθήνα','Κεντρικό θέατρο με κλασικές και σύγχρονες παραστάσεις.'),
(2,'Θέατρο Βορείου Ελλάδος','Θεσσαλονίκη','Μεγάλο θέατρο με ποικιλία παραστάσεων.'),
(3,'Θέατρο Πάτρας','Πάτρα','Τοπικό θέατρο με πολιτιστικές εκδηλώσεις.');
/*!40000 ALTER TABLE `theatres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'Kostas','kostas@example.com','$2b$10$AukYTPnLcz0e.3GzP01NuOo.5zKUDxVFQgVrYZnrhklNP0oowTtyW','2026-05-20 13:12:20'),
(2,'geo','kotsos@outlook.com','$2b$10$//OFmcIt9Jz25PLy9rWraeHlHnAX9zaMEomud7WSTDxRWO7lP3WP.','2026-05-20 17:21:00'),
(3,'Teo','Teo@gmail.com','$2b$10$bIIR/uu.Da2eLHwhEqHZeeijZfS9k730iYNmfxL15.NdOPgkPhG9m','2026-05-21 23:32:21');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'theatre_booking_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-05-28 16:37:50
