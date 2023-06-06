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
  `r_id` INT NOT NULL AUTO_INCREMENT,
  `r_username` VARCHAR(45) NOT NULL,
  `r_password` VARCHAR(45) NOT NULL,
  `r_phone` VARCHAR(45),
  `r_realname` VARCHAR(15) NOT NULL,
  `r_email` VARCHAR(45) NOT NULL,
  `r_point` INT NOT NULL DEFAULT 0,
  `r_birth` DATE NULL,
  `created_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`r_id`),
  UNIQUE INDEX `r_phone_UNIQUE` (`r_phone` ASC) VISIBLE,
  UNIQUE INDEX `r_username_UNIQUE` (`r_username` ASC) VISIBLE,
  UNIQUE INDEX `r_id_UNIQUE` (`r_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`agentList`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`agentList` (
  `ra_regno` VARCHAR(30) NOT NULL,
  `rdealer_nm` VARCHAR(45) NOT NULL,
  `cmp_nm` VARCHAR(45) NOT NULL,
  `telno` VARCHAR(140) NOT NULL,
  `address` VARCHAR(70) NOT NULL,
  `sgg_nm` VARCHAR(45) NOT NULL,
  `bjdong_nm` VARCHAR(45) NOT NULL,
  `rating` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`ra_regno`),
  UNIQUE INDEX `ra_regno_UNIQUE` (`ra_regno` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`agent`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`agent`(
`a_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
`agentList_ra_regno` VARCHAR(30) NOT NULL UNIQUE,
`a_username` VARCHAR(45) NOT NULL,
`a_password` VARCHAR(200) NOT NULL,
`a_realname` VARCHAR(45) NOT NULL,
`a_email` VARCHAR(45) NOT NULL UNIQUE,
`a_phone` VARCHAR(45) NULL,
`a_auth` TINYINT(4) NOT NULL DEFAULT 0,
`a_auth_image` LONGBLOB NULL,
`a_introduction` VARCHAR(45) NULL,
`a_office_hours` VARCHAR(45) NULL,
`a_profile_image` LONGBLOB NULL,
`a_image1` LONGBLOB NULL,
`a_image2` LONGBLOB NULL,
`a_image3` LONGBLOB NULL,
`created_time` TIMESTAMP DEFAULT NOW(),
`updated_time` TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (agentList_ra_regno)
REFERENCES agentList(ra_regno) ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `mydb`.`review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`review` (
  `rv_id` INT NOT NULL AUTO_INCREMENT,
  `resident_r_id` INT NOT NULL,
  `agentList_ra_regno` VARCHAR(30) NOT NULL,
  `rating` INT NOT NULL DEFAULT 0,
  `content` VARCHAR(45) NULL,
  `created_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rv_id`, `resident_r_id`, `agentList_ra_regno`),
  INDEX `fk_review_resident1_idx` (`resident_r_id` ASC) VISIBLE,
  INDEX `fk_review_agentList1_idx` (`agentList_ra_regno` ASC) VISIBLE,
  CONSTRAINT `fk_review_resident1`
    FOREIGN KEY (`resident_r_id`)
    REFERENCES `mydb`.`resident` (`r_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_review_agentList1`
    FOREIGN KEY (`agentList_ra_regno`)
    REFERENCES `mydb`.`agentList` (`ra_regno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`opened_review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`opened_review` (
  `resident_r_id` INT NOT NULL,
  `review_rv_id` INT NOT NULL,
  `created_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`resident_r_id`, `review_rv_id`),
  INDEX `fk_resident_has_review_review1_idx` (`review_rv_id` ASC) VISIBLE,
  INDEX `fk_resident_has_review_resident1_idx` (`resident_r_id` ASC) VISIBLE,
  CONSTRAINT `fk_resident_has_review_resident1`
    FOREIGN KEY (`resident_r_id`)
    REFERENCES `mydb`.`resident` (`r_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_resident_has_review_review1`
    FOREIGN KEY (`review_rv_id`)
    REFERENCES `mydb`.`review` (`rv_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`bookmark`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`bookmark` (
  `bm_id` INT NOT NULL AUTO_INCREMENT,
  `agentList_ra_regno` VARCHAR(30) NOT NULL,
  `resident_r_id` INT NOT NULL,
  PRIMARY KEY (`bm_id`),
  INDEX `fk_bookmark_agentList1_idx` (`agentList_ra_regno` ASC) VISIBLE,
  INDEX `fk_bookmark_resident1_idx` (`resident_r_id` ASC) VISIBLE,
  CONSTRAINT `fk_bookmark_agentList1`
    FOREIGN KEY (`agentList_ra_regno`)
    REFERENCES `mydb`.`agentList` (`ra_regno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_bookmark_resident1`
    FOREIGN KEY (`resident_r_id`)
    REFERENCES `mydb`.`resident` (`r_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`agent_contact`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`agent_contact` (
  `contact_number` VARCHAR(20) NOT NULL,
  `agentList_ra_regno` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`contact_number`, `agentList_ra_regno`),
  UNIQUE INDEX `contact_number_UNIQUE` (`contact_number` ASC) VISIBLE,
  INDEX `fk_agent_contact_agentList1_idx` (`agentList_ra_regno` ASC) VISIBLE,
  CONSTRAINT `fk_agent_contact_agentList1`
    FOREIGN KEY (`agentList_ra_regno`)
    REFERENCES `mydb`.`agentList` (`ra_regno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Table `mydb`.`certification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`certification` (
  `email` VARCHAR(255) CHARACTER SET 'utf8' NOT NULL,
  `code` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;