-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema serversystem
-- -----------------------------------------------------
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`resident`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`resident` (
  `r_id` INT NOT NULL AUTO_INCREMENT UNIQUE,
  `r_username` VARCHAR(45) NOT NULL UNIQUE,
  `r_password` VARCHAR(45) NOT NULL,
  `r_phone` VARCHAR(45) NOT NULL UNIQUE,
  `r_realname` VARCHAR(15) NOT NULL,
  `r_email` VARCHAR(45) NOT NULL,
  `r_point` INT NOT NULL DEFAULT 0,
  `r_birth` DATE NULL,
  `created_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`r_id`)
  );


-- -----------------------------------------------------
-- Table `mydb`.`agentList`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`agentList` (
  `ra_regno` VARCHAR(30) NOT NULL UNIQUE,
  `rdealer_nm` VARCHAR(45) NOT NULL,
  `cmp_nm` VARCHAR(45) NOT NULL,
  `telno` VARCHAR(45) NOT NULL,
  `address` VARCHAR(70) NOT NULL,
  `sgg_nm` VARCHAR(45) NOT NULL,
  `bjdong_nm` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ra_regno`));


-- -----------------------------------------------------
-- Table `mydb`.`agent`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`agent` (
  `a_id` INT NOT NULL AUTO_INCREMENT UNIQUE,
  `agentList_ra_regno` VARCHAR(30) NOT NULL,
  `a_username` VARCHAR(45) NOT NULL,
  `a_password` VARCHAR(45) NOT NULL,
  `a_realname` VARCHAR(45) NOT NULL,
  `a_email` VARCHAR(45) NOT NULL UNIQUE,
  `a_auth` TINYINT NOT NULL DEFAULT 0,
  `a_auth_image` LONGBLOB NOT NULL,
  `a_introduction` VARCHAR(45) NULL,
  `a_office_hours` VARCHAR(45) NULL,
  `a_image1` LONGBLOB NULL,
  `a_image2` LONGBLOB NULL,
  `a_image3` LONGBLOB NULL,
  `created_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`a_id`, `agentList_ra_regno`),
  CONSTRAINT `fk_agent_agentList1`
    FOREIGN KEY (`agentList_ra_regno`)
    REFERENCES `mydb`.`agentList` (`ra_regno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `mydb`.`review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`review` (
  `rv_id` INT NOT NULL AUTO_INCREMENT UNIQUE,
  `resident_r_id` INT NOT NULL,
  `agentList_ra_regno` VARCHAR(30) NOT NULL,
  `rating` INT NOT NULL DEFAULT 0,
  `content` VARCHAR(45) NULL,
  `created_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`rv_id`, `resident_r_id`, `agentList_ra_regno`),
  CONSTRAINT `fk_review_resident1`
    FOREIGN KEY (`resident_r_id`)
    REFERENCES `mydb`.`resident` (`r_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_review_agentList1`
    FOREIGN KEY (`agentList_ra_regno`)
    REFERENCES `mydb`.`agentList` (`ra_regno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `mydb`.`opened_review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`opened_review` (
  `resident_r_id` INT NOT NULL,
  `review_rv_id` INT NOT NULL,
  `created_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`resident_r_id`, `review_rv_id`),
  CONSTRAINT `fk_resident_has_review_resident1`
    FOREIGN KEY (`resident_r_id`)
    REFERENCES `mydb`.`resident` (`r_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_resident_has_review_review1`
    FOREIGN KEY (`review_rv_id`)
    REFERENCES `mydb`.`review` (`rv_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `mydb`.`bookmark`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`bookmark` (
  `bm_id` INT NOT NULL AUTO_INCREMENT,
  `agentList_ra_regno` VARCHAR(30) NOT NULL,
  `resident_r_id` INT NOT NULL,
  PRIMARY KEY (`bm_id`),
  CONSTRAINT `fk_bookmark_agentList1`
    FOREIGN KEY (`agentList_ra_regno`)
    REFERENCES `mydb`.`agentList` (`ra_regno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_bookmark_resident1`
    FOREIGN KEY (`resident_r_id`)
    REFERENCES `mydb`.`resident` (`r_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `mydb`.`agent_contact`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`agent_contact` (
  `contact_number` VARCHAR(20) NOT NULL UNIQUE,
  `agent_a_id` INT NOT NULL,
  `agent_agentList_ra_regno` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`contact_number`, `agent_a_id`),
  CONSTRAINT `fk_agent_contact_agent1`
    FOREIGN KEY (`agent_a_id`)
    REFERENCES `mydb`.`agent` (`a_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
