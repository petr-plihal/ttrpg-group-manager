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
INSERT INTO `group` (`name`, `description`, `location`, `isopen`, `languages`, `maxsize`, `dmneeded`, `gameid`) VALUES
('Adventurers', 'A group for D&D enthusiasts.', 'New York', 1, 'English', 5, 1, 1),
('Esploratori', 'A group for Pathfinder players.', 'Online', 0, 'Italian', 4, 0, 2),
('Catan Club', 'A group for Catan players.', 'Chicago', 1, 'English', 6, 0, 3),
('Test Group Name', 'A group for Risk players.', 'Online', 1, 'English', 4, 0, 4);

-- -----------------------------------------------------
-- Insert data into `application`
-- -----------------------------------------------------
INSERT INTO `application` (`applicantid`, `groupid`, `description`) VALUES
(1, 2, 'Looking to join a D&D group.'),
(2, 3, 'Interested in Pathfinder.'),
(3, 4, 'Catan is my favorite game.'),
(4, 1, 'I enjoy playing Risk.');

-- -----------------------------------------------------
-- Insert data into `belongsto`
-- -----------------------------------------------------
INSERT INTO `belongsto` (`userid`, `groupid`, `isowner`, `isdm`, `nickname`) VALUES
(1, 1, 1, 1, 'Dungeon Master'),
(2, 2, 1, 1, 'Pathfinder Leader'),
(3, 3, 1, 1, 'Catan Champion'),
(4, 4, 1, 1, 'Risk Master'),
(2, 1, 0, 0, 'Nikkita'),
(3, 2, 0, 0, ''),
(4, 3, 0, 0, ''),
(1, 4, 0, 0, 'Player2');

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

-- -----------------------------------------------------
-- Insert data into `chat`
-- -----------------------------------------------------
INSERT INTO `TTRPGLFG_chat` (`applicationid`, `chattype`) VALUES
(1, 'APP'),
(2, 'APP'),
(3, 'APP'),
(4, 'APP');

INSERT INTO `TTRPGLFG_chat` (`groupid`, `chattype`) VALUES
(1, 'GRP'),
(2, 'GRP'),
(3, 'GRP'),
(4, 'GRP');