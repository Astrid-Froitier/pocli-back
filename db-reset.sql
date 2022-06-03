CREATE TABLE IF NOT EXISTS `users` ( `id` INT NOT NULL AUTO_INCREMENT, `firstname` VARCHAR(50) NOT NULL, `lastname` VARCHAR(100) NOT NULL, `email` VARCHAR(150) NOT NULL, `password` VARCHAR(100) NOT NULL, `streetNumber` INT NOT NULL, `address` VARCHAR(100) NOT NULL, `zipCode` INT NOT NULL, `city` VARCHAR(100) NOT NULL, `phoneNumber` INT NOT NULL, `isAdmin` BOOL NOT NULL, `isIntervenant` BOOL NOT NULL, `isAdherent` BOOL NOT NULL, `isVolunteer` BOOL NOT NULL, PRIMARY KEY(`id`));


CREATE TABLE IF NOT EXISTS `partnersTypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `newsTypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `news` (
`id` INT auto_increment PRIMARY KEY,
`date` INT NOT NULL,
`streetNumber` INT NOT NULL,
`address` VARCHAR(100) NOT NULL,
`zipCode` INT NOT NULL,
`city` VARCHAR(100) NOT NULL,
`hours` INT NOT NULL,
`numberOfParticipants` INT NOT NULL,
`idUser` INT NOT NULL,
CONSTRAINT fk_news_user   
        FOREIGN KEY (idUser)             
        REFERENCES users(id),
`idNewsType` INT NOT NULL,
        CONSTRAINT fk_news_newsType   
        FOREIGN KEY (idNewsType)             
        REFERENCES newsTypes(id)
);


CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `text` VARCHAR(255) NOT NULL,
  `dateCreated` DATE NOT NULL,
  `dateModerated` DATE NOT NULL,
  `idUser` INT,
        CONSTRAINT fk_comments_user      
        FOREIGN KEY (idUser)             
        REFERENCES users(id), 
  `idUserAdmin` INT,
        CONSTRAINT fk_comments_userAdmin      
        FOREIGN KEY (idUserAdmin)             
        REFERENCES users(id), 
  `idNew` INT,
        CONSTRAINT fk_comments_new      
        FOREIGN KEY (idNew)             
        REFERENCES news(id) 
);

CREATE TABLE IF NOT EXISTS`partners`
(
    `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `logo` VARCHAR(100) NOT NULL,
    `url` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) ,
    `siretNumber` INT ,

    `idPartnerType` INT NOT NULL,
    CONSTRAINT fk_partnerTypes_users      
    FOREIGN KEY (idPartnerType)             
    REFERENCES partnersTypes(id),

    `idUser` INT NOT NULL,
    CONSTRAINT fk_partners_user      
    FOREIGN KEY (idUser)             
    REFERENCES users(id) 
);

CREATE TABLE IF NOT EXISTS `historyPartners`
(
    `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `logo` VARCHAR(100) NOT NULL,
    `url` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255),
    `siretNumber` INT,


    `idType` INT NOT NULL,
        CONSTRAINT fk_historyPartner_type      
        FOREIGN KEY (idType)             
        REFERENCES users(id),



    `idUserPost` INT NOT NULL,
        CONSTRAINT fk_post_users      
        FOREIGN KEY (idUserPost)             
        REFERENCES users(id),


    `idPartner` INT NOT NULL,
    CONSTRAINT fk_partner_user     
    FOREIGN KEY (idPartner)             
    REFERENCES users(id)
);



CREATE TABLE IF NOT EXISTS `historyUsers` ( `id`INT  AUTO_INCREMENT  PRIMARY KEY, `firstname` VARCHAR(50) NOT NULL, `lastname` VARCHAR(100) NOT NULL, `email` VARCHAR(150) NOT NULL, `password` VARCHAR(100) NOT NULL, `streetNumber` INT NOT NULL, `address` VARCHAR(100) NOT NULL, `zipCode` INT NOT NULL, `city` VARCHAR(100) NOT NULL, `phoneNumber` INT NOT NULL, `isAdmin` BOOL NOT NULL, `isIntervenant` BOOL NOT NULL, `isAdherent` BOOL NOT NULL, `isVolunteer` BOOL NOT NULL, `idUserPost` INT NOT NULL, CONSTRAINT fk_historyUsers_userPost FOREIGN KEY(`idUserPost`) REFERENCES users(`id`), `idUserAdmin` INT NOT NULL, CONSTRAINT fk_historyUsers_userAdmin FOREIGN KEY(`idUserAdmin`) REFERENCES users(`id`));

CREATE TABLE IF NOT EXISTS `historyNews`(
`id` INT auto_increment PRIMARY KEY,
`date` INT NOT NULL,
`streetNumber` INT,
`address` VARCHAR(100),
`zipCode` INT,
`city` VARCHAR(100),
`hours` INT NOT NULL,
`numberOfParticipants` INT,
`idUserPost` INT,
CONSTRAINT fk_historyNews_userPost   
        FOREIGN KEY (idUserPost)             
        REFERENCES users(id),
`idUserAdmin` INT,
CONSTRAINT fk_historyNews_userAdmin   
        FOREIGN KEY (idUserAdmin)             
        REFERENCES users(id),
`idNew` INT,
CONSTRAINT fk_historyNews_new  
        FOREIGN KEY (idNew)             
        REFERENCES news(id)
);  
