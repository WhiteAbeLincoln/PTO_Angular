-- phpMyAdmin SQL Dump
-- version 4.2.12deb2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 17, 2015 at 07:33 PM
-- Server version: 5.6.24-0ubuntu2
-- PHP Version: 5.6.4-4ubuntu6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `pto_dev`
--
CREATE DATABASE IF NOT EXISTS `pto` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `pto`;

-- --------------------------------------------------------

--
-- Table structure for table `Articles`
--

CREATE TABLE IF NOT EXISTS `Articles` (
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `author` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `datetime` datetime NOT NULL,
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `urlSlug` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pictureUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Calendar`
--

CREATE TABLE IF NOT EXISTS `Calendar` (
`id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  `location` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `contact` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Downloads`
--

CREATE TABLE IF NOT EXISTS `Downloads` (
`downloadId` int(11) NOT NULL,
  `downloadType` int(11) NOT NULL,
  `downloadName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `shortDesc` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `modDate` datetime NOT NULL,
  `mimeType` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `DownloadTypes`
--

CREATE TABLE IF NOT EXISTS `DownloadTypes` (
`typeId` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Members`
--

CREATE TABLE IF NOT EXISTS `Members` (
`id` int(11) NOT NULL,
  `lastName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `firstName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `city` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `state` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `zipCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `M_Payments`
--

CREATE TABLE IF NOT EXISTS `M_Payments` (
`id` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `charge` varchar(255) NOT NULL,
  `nameFirst` varchar(255) NOT NULL,
  `nameLast` varchar(255) NOT NULL,
  `amount` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `M_Students`
--

CREATE TABLE IF NOT EXISTS `M_Students` (
`id` int(11) NOT NULL,
  `parentId` int(11) NOT NULL,
  `grade` varchar(2) NOT NULL,
  `unit` varchar(1) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Scholarships`
--

CREATE TABLE IF NOT EXISTS `Scholarships` (
`id` int(11) NOT NULL,
  `lastName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `firstName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `middleName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `homeAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `city` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `state` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'Is this really needed?',
  `zipCode` varchar(255) NOT NULL,
  `phoneNumber` varchar(12) NOT NULL,
  `emailAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `essay` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `gpa` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `S_Activities`
--

CREATE TABLE IF NOT EXISTS `S_Activities` (
`id` int(11) NOT NULL,
  `applicationId` int(11) NOT NULL,
  `activityName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `hours` int(11) NOT NULL,
  `nine` tinyint(1) NOT NULL,
  `ten` tinyint(1) NOT NULL,
  `eleven` tinyint(1) NOT NULL,
  `twelve` tinyint(1) NOT NULL,
  `position` varchar(7) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `activityType` varchar(11) NOT NULL COMMENT 'school or community'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `S_Classes`
--

CREATE TABLE IF NOT EXISTS `S_Classes` (
`id` int(11) NOT NULL,
  `applicationId` int(11) NOT NULL,
  `nine` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `ten` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `eleven` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `twelve` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `S_Employment`
--

CREATE TABLE IF NOT EXISTS `S_Employment` (
`id` int(11) NOT NULL,
  `applicationId` int(11) NOT NULL,
  `jobName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `hours` int(11) NOT NULL,
  `months` int(11) NOT NULL,
  `nine` tinyint(1) NOT NULL,
  `ten` tinyint(1) NOT NULL,
  `eleven` tinyint(1) NOT NULL,
  `twelve` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `S_Honors`
--

CREATE TABLE IF NOT EXISTS `S_Honors` (
`id` int(11) NOT NULL,
  `applicationId` int(11) NOT NULL,
  `honorName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `nine` tinyint(1) NOT NULL,
  `ten` tinyint(1) NOT NULL,
  `eleven` tinyint(1) NOT NULL,
  `twelve` tinyint(1) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Articles`
--
ALTER TABLE `Articles`
 ADD PRIMARY KEY (`date`,`urlSlug`);

--
-- Indexes for table `Calendar`
--
ALTER TABLE `Calendar`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Downloads`
--
ALTER TABLE `Downloads`
 ADD PRIMARY KEY (`downloadId`), ADD KEY `Downloads_ibfk_1` (`downloadType`);

--
-- Indexes for table `DownloadTypes`
--
ALTER TABLE `DownloadTypes`
 ADD PRIMARY KEY (`typeId`);

--
-- Indexes for table `Members`
--
ALTER TABLE `Members`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `M_Payments`
--
ALTER TABLE `M_Payments`
 ADD PRIMARY KEY (`id`), ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `M_Students`
--
ALTER TABLE `M_Students`
 ADD PRIMARY KEY (`id`), ADD KEY `parentId` (`parentId`);

--
-- Indexes for table `Scholarships`
--
ALTER TABLE `Scholarships`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `S_Activities`
--
ALTER TABLE `S_Activities`
 ADD PRIMARY KEY (`id`), ADD KEY `applicationId` (`applicationId`);

--
-- Indexes for table `S_Classes`
--
ALTER TABLE `S_Classes`
 ADD PRIMARY KEY (`id`), ADD KEY `applicationId` (`applicationId`);

--
-- Indexes for table `S_Employment`
--
ALTER TABLE `S_Employment`
 ADD PRIMARY KEY (`id`), ADD KEY `applicationId` (`applicationId`);

--
-- Indexes for table `S_Honors`
--
ALTER TABLE `S_Honors`
 ADD PRIMARY KEY (`id`), ADD KEY `applicationId` (`applicationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Calendar`
--
ALTER TABLE `Calendar`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Downloads`
--
ALTER TABLE `Downloads`
MODIFY `downloadId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `DownloadTypes`
--
ALTER TABLE `DownloadTypes`
MODIFY `typeId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Members`
--
ALTER TABLE `Members`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `M_Payments`
--
ALTER TABLE `M_Payments`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `M_Students`
--
ALTER TABLE `M_Students`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Scholarships`
--
ALTER TABLE `Scholarships`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `S_Activities`
--
ALTER TABLE `S_Activities`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `S_Classes`
--
ALTER TABLE `S_Classes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `S_Employment`
--
ALTER TABLE `S_Employment`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `S_Honors`
--
ALTER TABLE `S_Honors`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Downloads`
--
ALTER TABLE `Downloads`
ADD CONSTRAINT `Downloads_ibfk_1` FOREIGN KEY (`downloadType`) REFERENCES `DownloadTypes` (`typeId`) ON DELETE CASCADE;

--
-- Constraints for table `M_Payments`
--
ALTER TABLE `M_Payments`
ADD CONSTRAINT `M_Payments_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `Members` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `M_Students`
--
ALTER TABLE `M_Students`
ADD CONSTRAINT `M_Students_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `Members` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `S_Activities`
--
ALTER TABLE `S_Activities`
ADD CONSTRAINT `S_Activities_ibfk_1` FOREIGN KEY (`applicationId`) REFERENCES `Scholarships` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `S_Classes`
--
ALTER TABLE `S_Classes`
ADD CONSTRAINT `S_Classes_ibfk_1` FOREIGN KEY (`applicationId`) REFERENCES `Scholarships` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `S_Employment`
--
ALTER TABLE `S_Employment`
ADD CONSTRAINT `S_Employment_ibfk_1` FOREIGN KEY (`applicationId`) REFERENCES `Scholarships` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `S_Honors`
--
ALTER TABLE `S_Honors`
ADD CONSTRAINT `S_Honors_ibfk_1` FOREIGN KEY (`applicationId`) REFERENCES `Scholarships` (`id`) ON DELETE CASCADE;

-- Add the Admins table, with default user

CREATE TABLE IF NOT EXISTS `Admins` (
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(768) NOT NULL,
  `salt` varchar(768) NOT NULL,
  `registrationDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Admins`
--

INSERT INTO `Admins` (`firstName`, `lastName`, `email`, `type`, `username`, `password`, `salt`, `registrationDate`) VALUES
('Brent', 'Moore', 'Brent@eaglemarketingllc.com', 'admin', 'Admin', 'RciDXagj5vwISe/F5yQYI3ugx+9Tfu/pG4fIMPJq4TFffXZjTHHb6slX6rzkzz8mVKjtgg4IckWakIBOjxsfAo46W1aDF3FVEmd2Acz4JzB9VQtqFWajQYxaiL4tV9cRqIp9zWe6tbI/gTBE/a9+1WO5Gv2yaHV9ytHKLswAwnzdqY1yNq2+R+l70UmJaXpUehWCcfUMrMhKyq68prOyL9ztUO/SVFuRmA61r1zFzv8tAzXWlQmsEcoVikF7/0hM7He4feDLoetRKqj/qet7SHhReA58Xu+Y4AiCLbcOKlIoVxaTEzjxmKay8HaRLHVdPNEaAAUnJ8bvoFYsGUbqrO+GaOTW1iHDYrlAAMB2goKKsXmfuHNm8ycL6cHTQ4uaFnEb3vCJmM6pYvoKPXl3LQuSgqZn3rxjbX/N6zN+3c7SI4n7bEFMvjQkBqMO1GXBsmU/EtSvps5Aoc7HHwEMd/zL/TB2W+IgAWn5MfW37d0qmbBE/paSouUYFYTi3+kcrTUiojhYhlQ5hn/qzR3loQXjYyjHICBNw209U41giu2tdjK0cYw53jiXThtFloLvZavjgxMmfMS/ZEVRpXwWWq8GkafYwpV6D9Wkp/B+0605YTFvdfBY6kTlZpDKxlbhKQMwEOjfPowpMZ6UMhG9IVC0YIHY5/epF661nxQZx0g=', 'qJR3gao4XCsn3/DFORzG2JU43CsRAFb0VMCDIjOCS6OK562kKV8kYbTsqjLKN6LclnSZF9XsdmFzP4caMJjYRlgt1rI5TPD+gRZlBaMLtuqkjXnG6/tLb7eOf3/y7KtkEqNcjqPMEcAib59Uv1gYPqiXwWmwq4iFUDW2o6cePtLMKjOVEQe7X39is30t3JeVVQVyixlFM0+TXoJDnpjyhoYC73+C2Rw9RN6k8RGKCDCWW4MCyvB+V4RZEOlPFn5YlkI8K/awWJ2jq7VyjtJz+MwLJlWc7BrqMEoAYzZBdWsmQbLHflf+064Tng4AAHCvq6F6EA9aAM8sKJNlIv4280omVt4h3HlGfJQI66yOqgINXN7+hRpXiUqUKIrf+zWzZpY72cZQDHvhZd5I5sYQjbgXU6ciZcWtsG76y+y6lQ2Etco5GcyBQ57vV4e2zttbxPQ8s+I0uRGZ8ysmQ4VOtFFrncG+rIWGNfqgZUe9vv6yJAcmIbMW0ZdWSQx5BnjcQhaZZ1vTn9RGwl/V6+nUT7aCkqOh110FkD1Vyl+5Lh9Y7Y1Qq3yEkJGtkhuGkMI6YGQCvpwFU5koYAIK3jWKK3sapuUn/r/QMbDgvDK7fihn9RQy7zpQWQzDo6m1moBkdVuL8G1riBVW/4Z+KPYoyq7lYhkg0u3yR9M5GE4l3wU=', '2015-05-06 02:06:42');

--
-- Indexes for table `Admins`
--
ALTER TABLE `Admins`
 ADD PRIMARY KEY (`username`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
