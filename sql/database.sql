-- -----------------------------------------------------
-- Drop tables in the correct order
-- -----------------------------------------------------
-- DROP TABLE IF EXISTS `usertag`;
-- DROP TABLE IF EXISTS `grouptag`;
-- DROP TABLE IF EXISTS `schedule`;
-- DROP TABLE IF EXISTS `session`;
-- DROP TABLE IF EXISTS `belongsto`;
-- DROP TABLE IF EXISTS `application`;
-- DROP TABLE IF EXISTS `group`;
-- DROP TABLE IF EXISTS `tag`;
-- DROP TABLE IF EXISTS `game`;
-- DROP TABLE IF EXISTS `user`;


-- -----------------------------------------------------
-- Table and relations initialization
-- -----------------------------------------------------


-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(30) NOT NULL,
  `profilepicture` VARCHAR(255) NULL DEFAULT NULL,
  `description` VARCHAR(600) NULL DEFAULT NULL,
  `candm` BOOLEAN NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE
);

-- -----------------------------------------------------
-- Table `game`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `game` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(600) NOT NULL,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(600) NULL DEFAULT NULL,
  `location` VARCHAR(45) NOT NULL,
  `isopen` BOOLEAN NOT NULL DEFAULT '0',
  `languages` VARCHAR(45) NULL DEFAULT NULL,
  `maxsize` INT NOT NULL DEFAULT '1',
  `dmneeded` BOOLEAN NOT NULL DEFAULT '0',
  `gameid` INT NOT NULL,
  `groupchatcontent` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  INDEX `fk_game_group_idx` (`gameid` ASC) VISIBLE,
  CONSTRAINT `fk_game_group`
    FOREIGN KEY (`gameid`)
    REFERENCES `game` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `application`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `application` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `applicantid` INT NOT NULL,
  `groupid` INT NOT NULL,
  `description` VARCHAR(600) NULL DEFAULT NULL,
  `appchatcontent` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_application_idx` (`applicantid` ASC) VISIBLE,
  INDEX `fk_group_application_idx` (`groupid` ASC) VISIBLE,
  CONSTRAINT `fk_user_application`
    FOREIGN KEY (`applicantid`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_group_application`
    FOREIGN KEY (`groupid`)
    REFERENCES `group` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `belongsto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `belongsto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `groupid` INT NOT NULL,
  `isowner` BOOLEAN NOT NULL,
  `nickname` VARCHAR(30) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_belongs_to_idx` (`userid` ASC) VISIBLE,
  INDEX `fk_group_belongs_to_idx` (`groupid` ASC) VISIBLE,
  CONSTRAINT `fk_user_belongsto`
    FOREIGN KEY (`userid`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_group_belongsto`
    FOREIGN KEY (`groupid`)
    REFERENCES `group` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE
);

-- -----------------------------------------------------
-- Table `grouptag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grouptag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `groupid` INT NOT NULL,
  `tagid` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tag_grouptag_idx` (`tagid` ASC) VISIBLE,
  INDEX `fk_group_grouptag_idx` (`groupid` ASC) VISIBLE,
  CONSTRAINT `fk_tag_grouptag`
    FOREIGN KEY (`tagid`)
    REFERENCES `tag` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_group_grouptag`
    FOREIGN KEY (`groupid`)
    REFERENCES `group` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `schedule`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schedule` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `day` ENUM('mo', 'tu', 'we', 'th', 'fr', 'sa', 'su') NOT NULL,
  `starttime` TIME NOT NULL DEFAULT '00:00:00',
  `endtime` TIME NOT NULL DEFAULT '23:59:59',
  PRIMARY KEY (`id`),
  INDEX `id_idx` (`userid` ASC) VISIBLE,
  CONSTRAINT `fk_user_schedule`
    FOREIGN KEY (`userid`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `session`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `session` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `groupid` INT NOT NULL,
  `num` INT NULL DEFAULT NULL,
  `description` VARCHAR(600) NULL DEFAULT NULL,
  `starttime` DATETIME NOT NULL,
  `duration` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_group_session_idx` (`groupid` ASC) VISIBLE,
  CONSTRAINT `fk_group_session`
    FOREIGN KEY (`groupid`)
    REFERENCES `group` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `usertag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usertag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `tagid` INT NOT NULL,
  `islooking` BOOLEAN NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_user_id_idx` (`userid` ASC) VISIBLE,
  INDEX `fk_tag_usertag_idx` (`tagid` ASC) VISIBLE,
  CONSTRAINT `fk_user_usertag`
    FOREIGN KEY (`userid`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tag_usertag`
    FOREIGN KEY (`tagid`)
    REFERENCES `tag` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Example data
-- -----------------------------------------------------


-- -----------------------------------------------------
-- Insert data into `user`
-- -----------------------------------------------------
INSERT INTO `user` (`username`, `profilepicture`, `description`, `candm`) VALUES
('xxxPepik69', '<URL>/profile1.jpg', 'A passionate gamer.', 1),
('jane_doe', '<URL>/profile2.jpg', 'Loves RPG games.', 0),
('Bao bei', '<URL>/profile3.jpg', 'test description', 1),
('cazzo-grasso', '<URL>/profile4.jpg', 'Appassionato di giochi da tavolo.', 0);

-- -----------------------------------------------------
-- Insert data into `game`
-- -----------------------------------------------------
INSERT INTO `game` (`name`, `description`) VALUES
('Dungeons & Dragons', 'A fantasy tabletop role-playing game.'),
('Pathfinder', 'A role-playing game that evolved from D&D.'),
('Catan', 'A popular board game.'),
('Risk', 'A strategy board game.');

-- -----------------------------------------------------
-- Insert data into `group`
-- -----------------------------------------------------
INSERT INTO `group` (`name`, `description`, `location`, `isopen`, `languages`, `maxsize`, `dmneeded`, `gameid`, `groupchatcontent`) VALUES
('Adventurers', 'A group for D&D enthusiasts.', 'New York', 1, 'English', 5, 1, 1, 'Some sort of data structure? Long string?'),
('Esploratori', 'A group for Pathfinder players.', 'Online', 0, 'Italian', 4, 0, 2, 'Some sort of data structure? Long string?'),
('Catan Club', 'A group for Catan players.', 'Chicago', 1, 'English', 6, 0, 3, 'Some sort of data structure? Long string?'),
('Test Group Name', 'A group for Risk players.', 'Online', 1, 'English', 4, 0, 4, 'Some sort of data structure? Long string?');

-- -----------------------------------------------------
-- Insert data into `application`
-- -----------------------------------------------------
INSERT INTO `application` (`applicantid`, `groupid`, `description`, `appchatcontent`) VALUES
(1, 1, 'Looking to join a D&D group.', ''),
(2, 2, 'Interested in Pathfinder.', ''),
(3, 3, 'Catan is my favorite game.', ''),
(4, 4, 'I enjoy playing Risk.', '');

-- -----------------------------------------------------
-- Insert data into `belongsto`
-- -----------------------------------------------------
INSERT INTO `belongsto` (`userid`, `groupid`, `isowner`, `nickname`) VALUES
(1, 1, 1, 'Dungeon Master'),
(2, 2, 1, 'Pathfinder Leader'),
(3, 3, 1, 'Catan Champion'),
(4, 4, 1, 'Risk Master'),
(2, 1, 0, 'Nikkita'),
(3, 2, 0, ''),
(4, 3, 0, ''),
(1, 4, 0, 'Player2');

-- -----------------------------------------------------
-- Insert data into `tag`
-- -----------------------------------------------------
INSERT INTO `tag` (`name`) VALUES
('RPG'),
('Fantasy'),
('Board Game'),
('Strategy');

-- -----------------------------------------------------
-- Insert data into `grouptag`
-- -----------------------------------------------------
INSERT INTO `grouptag` (`groupid`, `tagid`) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 3),
(4, 4);

-- -----------------------------------------------------
-- Insert data into `schedule`
-- -----------------------------------------------------
INSERT INTO `schedule` (`userid`, `day`, `starttime`, `endtime`) VALUES
(1, 'mo', '18:00:00', '21:00:00'),
(2, 'we', '19:00:00', '22:00:00'),
(3, 'fr', '20:00:00', '23:00:00'),
(4, 'su', '17:00:00', '20:00:00');

-- -----------------------------------------------------
-- Insert data into `session`
-- -----------------------------------------------------
INSERT INTO `session` (`groupid`, `num`, `description`, `starttime`, `duration`) VALUES
(1, 1, 'First session of the Adventurers group.', '2023-10-01 18:00:00', 180),
(2, 1, 'First session of the Pathfinders group.', '2023-10-02 19:00:00', 180),
(3, 1, 'First session of the Catan Club.', '2023-10-03 20:00:00', 180),
(4, 1, 'First session of the Risk Takers group.', '2023-10-04 17:00:00', 180);

-- -----------------------------------------------------
-- Insert data into `usertag`
-- -----------------------------------------------------
INSERT INTO `usertag` (`userid`, `tagid`, `islooking`) VALUES
(1, 1, 1),
(2, 2, 0),
(3, 3, 1),
(4, 4, 0);
