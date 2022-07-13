DROP DATABASE `pocli`;

CREATE DATABASE `pocli`;

USE `pocli`;

CREATE TABLE `linkedDocuments`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idDocument` INT NOT NULL,
    `idEvent` INT NULL,
    `idCommunication` INT NULL,
    `idFamilyMember` INT NULL,
    `idFamily` INT NULL
);

CREATE TABLE `communicationMembers`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idFamilyMember` INT NULL,
    `idFamily` INT NOT NULL,
    `idCommunication` INT NOT NULL,
    `isOpened` TINYINT(1) NOT NULL
);

CREATE TABLE `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(100) NOT NULL
);

CREATE TABLE `partners` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `logo` VARCHAR(100) NOT NULL,
    `url` VARCHAR(100) NOT NULL
);

CREATE TABLE `familyMemberEvents`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idFamilyMember` INT NOT NULL,
    `idEvent` INT NOT NULL
);

CREATE TABLE `communications`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `object` VARCHAR(255) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `date` DATETIME NOT NULL,
    `idAdmin` INT NOT NULL,
    `isBanner` TINYINT(1) NOT NULL
);

CREATE TABLE `familyMemberActivities`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idActivity` INT NOT NULL,
    `idFamilyMember` INT NOT NULL
);

CREATE TABLE `events`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `numberParticipantsMax` INT NULL,
    `date` VARCHAR(100) NOT NULL,
    `description` VARCHAR(100) NOT NULL,
    `text` TEXT NULL,
    `podcastLink` VARCHAR(255) NULL,
    `reservedAdherent` TINYINT(1) NOT NULL,
    `price` INT NULL,
    `idPostType` INT NOT NULL,
    `idActivity` INT NULL
);

CREATE TABLE `paymentRecords`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idPaymentMethod` INT NOT NULL,
    `checkNumber` VARCHAR(50) NULL,
    `isPaymentActivity` TINYINT(1) NOT NULL,
    `dateStart` DATETIME NOT NULL,
    `dateEnd` DATETIME NOT NULL,
    `amount` INT NOT NULL,
    `idFamily` INT NOT NULL,
    `idFamilyMember` INT NULL,
    `idActivity` INT NULL
);

CREATE TABLE `familyMembers`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idFamily` INT NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `birthday` DATETIME NOT NULL,
    `isActive` TINYINT(1) NOT NULL,
    `avatar` VARCHAR(255) NOT NULL
);

CREATE TABLE `families`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `streetNumber` INT NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phoneNumber` INT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `idCity` INT NOT NULL,
    `idRecipient` INT NOT NULL,
    `isActive` TINYINT(1) NOT NULL
);

CREATE TABLE `postTypes`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `documents`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `url` VARCHAR(255) NOT NULL
);

CREATE TABLE `activities`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `shortName` VARCHAR(100) NOT NULL
);

CREATE TABLE `recipients`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `cities`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `zipCode` INT NOT NULL
);

CREATE TABLE `paymentMethods`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `newsletters`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL
);

ALTER TABLE
    `paymentRecords`
ADD
    CONSTRAINT `paymentrecords_idpaymentmethod_foreign` FOREIGN KEY(`idPaymentMethod`) REFERENCES `paymentMethods`(`id`);

ALTER TABLE
    `paymentRecords`
ADD
    CONSTRAINT `paymentrecords_idfamily_foreign` FOREIGN KEY(`idFamily`) REFERENCES `families`(`id`);

ALTER TABLE
    `paymentRecords`
ADD
    CONSTRAINT `paymentrecords_idfamilymember_foreign` FOREIGN KEY(`idFamilyMember`) REFERENCES `familyMembers`(`id`);

ALTER TABLE
    `paymentRecords`
ADD
    CONSTRAINT `paymentrecords_idactivity_foreign` FOREIGN KEY(`idActivity`) REFERENCES `activities`(`id`);

ALTER TABLE
    `familyMembers`
ADD
    CONSTRAINT `familymembers_idfamily_foreign` FOREIGN KEY(`idFamily`) REFERENCES `families`(`id`);

ALTER TABLE
    `families`
ADD
    CONSTRAINT `families_idcity_foreign` FOREIGN KEY(`idCity`) REFERENCES `cities`(`id`);

ALTER TABLE
    `families`
ADD
    CONSTRAINT `families_idrecipient_foreign` FOREIGN KEY(`idRecipient`) REFERENCES `recipients`(`id`);

ALTER TABLE
    `familyMemberActivities`
ADD
    CONSTRAINT `familymemberactivities_idactivity_foreign` FOREIGN KEY(`idActivity`) REFERENCES `activities`(`id`);

ALTER TABLE
    `familyMemberActivities`
ADD
    CONSTRAINT `familymemberactivities_idfamilymember_foreign` FOREIGN KEY(`idFamilyMember`) REFERENCES `familyMembers`(`id`);

ALTER TABLE
    `communicationMembers`
ADD
    CONSTRAINT `communicationmembers_idcommunication_foreign` FOREIGN KEY(`idCommunication`) REFERENCES `communications`(`id`);

ALTER TABLE
    `communications`
ADD
    CONSTRAINT `communications_idadmin_foreign` FOREIGN KEY(`idAdmin`) REFERENCES `admins`(`id`);

ALTER TABLE
    `communicationMembers`
ADD
    CONSTRAINT `communicationmembers_idfamilyMember_foreign` FOREIGN KEY(`idFamilyMember`) REFERENCES `familyMembers`(`id`);

ALTER TABLE
    `communicationMembers`
ADD
    CONSTRAINT `communicationmembers_idfamily_foreign` FOREIGN KEY(`idFamily`) REFERENCES `families`(`id`);

ALTER TABLE
    `familyMemberEvents`
ADD
    CONSTRAINT `familymemberevents_idfamilymember_foreign` FOREIGN KEY(`idFamilyMember`) REFERENCES `familyMembers`(`id`);

ALTER TABLE
    `familyMemberEvents`
ADD
    CONSTRAINT `familymemberevents_idevent_foreign` FOREIGN KEY(`idEvent`) REFERENCES `events`(`id`);

ALTER TABLE
    `events`
ADD
    CONSTRAINT `events_idposttype_foreign` FOREIGN KEY(`idPostType`) REFERENCES `postTypes`(`id`);

ALTER TABLE
    `events`
ADD
    CONSTRAINT `events_idactivity_foreign` FOREIGN KEY(`idActivity`) REFERENCES `activities`(`id`);

ALTER TABLE
    `linkedDocuments`
ADD
    CONSTRAINT `linkeddocuments_iddocument_foreign` FOREIGN KEY(`idDocument`) REFERENCES `documents`(`id`);

ALTER TABLE
    `linkedDocuments`
ADD
    CONSTRAINT `linkeddocuments_idevent_foreign` FOREIGN KEY(`idEvent`) REFERENCES `events`(`id`);

ALTER TABLE
    `linkedDocuments`
ADD
    CONSTRAINT `linkeddocuments_idcommunication_foreign` FOREIGN KEY(`idCommunication`) REFERENCES `communications`(`id`);

ALTER TABLE
    `linkedDocuments`
ADD
    CONSTRAINT `linkeddocuments_idfamily_foreign` FOREIGN KEY(`idFamily`) REFERENCES `families`(`id`);

ALTER TABLE
    `linkedDocuments`
ADD
    CONSTRAINT `linkeddocuments_idfamilymember_foreign` FOREIGN KEY(`idFamilyMember`) REFERENCES `familyMembers`(`id`);

-- ACTIVITIES
INSERT INTO
    activities (`name`, `category`, `shortName`)
VALUES
    ('Part’Ages', 'Famille - Parentalité', 'family'),
    (
        'Parents Thèmes',
        'Famille - Parentalité',
        'family'
    ),
    ('Pilates', 'Sport et bien-être', 'sport'),
    ('Gym Douce', 'Sport et bien-être', 'sport'),
    ('Gym Seniors', 'Sport et bien-être', 'sport'),
    ('Bien-Être Solo', 'Sport et bien-être', 'sport'),
    ('Bien-Être Duo', 'Sport et bien-être', 'sport'),
    (
        'Visites de Convivialité',
        'Prévention - Action sociale',
        'social'
    ),
    (
        'Rencontres L.I.S.E',
        'Sport et bien-être',
        'sport'
    ),
    (
        'Animations locales',
        'Animation locale',
        'animation'
    );

-- POST TYPES
INSERT INTO
    postTypes (`name`)
VALUES
    ('Activité'),
    ('Article'),
    ('Podcast');

-- EVENTS
INSERT INTO
    events (
        `numberParticipantsMax`,
        `date`,
        `description`,
        `text`,
        `podcastLink`,
        `reservedAdherent`,
        `price`,
        `idPostType`,
        `idActivity`
    )
VALUES
    (
        3,
        '12/12/12',
        '“Atelier à venir..."Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa',
        null,
        0,
        100,
        1,
        1
    ),
    (
        10,
        '01/01/22',
        'Les activités proposées vous permettent, parents et grands-parents, de partager un moment avec',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa',
        null,
        0,
        1000,
        11,
        null
    ),
    (
        10,
        '12/04/10',
        'Moment convivial autour d’une activité partagée : découverte sensorielle, motricité, éveil',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa',
        null,
        1,
        1000,
        1,
        21
    ),
    (
        5,
        '12/12/12',
        'Vous pratiquerez des activités sportives dans une ambiance détendue et conviviale : pilates, gym',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa',
        null,
        1,
        500,
        21,
        null
    ),
    (
        25,
        '12/12/12',
        'Hello man',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa',
        null,
        1,
        50,
        1,
        71
    );

INSERT INTO
    cities (`name`, `zipCode`)
VALUES
    ('ABZAC', 33230),
    ('ARVEYRES', 33500),
    ('BAYAS', 33230),
    ('BONZAC', 33910),
    ('CADARSAC', 33750),
    ('CAMPS SUR L’ISLE', 33660),
    ('CHAMADELLE', 33230),
    ('COUTRAS', 33230),
    ('DAIGNAC', 33420),
    ('DARDENAC', 33420),
    ('ESPIET', 33420),
    ("GÉNISSAC", 33420),
    ('GOUR', 33660),
    ('GUÎTRES', 33230),
    ('IZON', 33450),
    ('LAGORCE', 33230),
    ('LALANDE DE POMEROL', 33500),
    ('LAPOUYADE', 33620),
    ('LE FIEU', 33230),
    ('LES BILLAUX', 33500),
    ('LES EGLISOTTES ET CHALAURES', 33230),
    ('LES PEINTURES', 33230),
    ('LIBOURNE', 33500),
    ('MARANSIN', 33230),
    ('MOULON', 33420),
    ('NÉRIGEAN', 33750),
    ('POMEROL', 33500),
    ('PORCHÈRES', 33660),
    ('PUYNORMAND', 33660),
    ('SABLON', 33910),
    ('SAINT ANTOINE DE L’ISLE', 33660),
    ('SAINT CHRISTOPHE DE DOUBLE', 33230),
    ('SAINT CIERS D’ABZAC', 33910),
    ('SAINT DENIS DE PILE', 33910),
    ('SAINT GERMAIN DU PUCH', 33750),
    ('SAINT MARTIN DE LAYE', 33910),
    ('SAINT MARTIN DU BOIS', 33910),
    ('SAINT MEDARD DE GUIZIERES', 33230),
    ('SAINT QUENTIN DE BARON', 33750),
    ('SAINT SAUVEUR DE PUYNORMAND', 33660),
    ('SAINT SEURIN DE L’ISLE', 33660),
    ('SAVIGNAC DE L’ISLE', 33910),
    ('TIZAC DE CURTON', 33531),
    ('TIZAC DE LAPOUYADE', 33620),
    ('VAYRES', 33870),
    ('BOSSUGAN', 33350),
    ('BRANNE', 33420),
    ('CABARA', 33420),
    ('CASTILLON LA BATAILLE', 33350),
    ('CIVRAC-SUR-DORDOGNE', 33350),
    ('COUBEYRAC', 33890),
    ('DOULEZON', 33350),
    ('FLAUJAGUES', 33350),
    ('GENSAC', 33890),
    ("GRÉZILLAC", 33420),
    ('GUILLAC', 33420),
    ('JUGAZAN', 33420),
    ('JUILLAC', 33890),
    ('LES SALLES DE CASTILLON', 33350),
    ('LUGAIGNAC', 33420),
    ('MERIGNAS', 33350),
    ('MOULIETS ET VILLEMARTIN', 33350),
    ('NAUJAN ET POSTIAC', 33420),
    ('PESSAC SUR DORDOGNE', 33890),
    ('PUJOLS SUR DORDOGNE', 33350),
    ('RAUZAN', 33420),
    ('RUCH', 33350),
    ('SAINT AUBIN DE BRANNE', 33420),
    ('SAINTE COLOMBE', 33350),
    ('SAINTE FLORENCE', 33350),
    ('SAINT JEAN DE BLAIGNAC', 33420),
    ('SAINT MAGNE DE CASTILLON', 33350),
    ('SAINT MICHEL DE MONTAIGNE', 24230),
    ('SAINT PEY DE CASTETS', 33350),
    ('SAINTE RADEGONDE', 33350),
    ('SAINT VINCENT DE PERTIGNAS', 33420),
    ('BARON', 33750),
    ('BLESIGNAC', 33670),
    ('CAPIAN', 33550),
    ('CARDAN', 33410),
    ('CREON', 33670),
    ('CURSAN', 33670),
    ('HAUX', 33550),
    ('LA SAUVE MAJEUR', 33670),
    ('LE POUT', 33670),
    ('LOUPES', 33370),
    ('MADIRAC', 33670),
    ('SADIRAC', 33670),
    ('SAINT GENES DE LOMBAUD', 33670),
    ('SAINT LEION', 33670),
    ('VILLENAVE DE RIONS', 33550);

INSERT INTO
    recipients (`name`)
VALUES
    ("CAF"),
    ("MSA"),
    ("None");

INSERT INTO
    families (
        `name`,
        `streetNumber`,
        `address`,
        `phoneNumber`,
        `email`,
        `password`,
        `idCity`,
        `idRecipient`,
        `isActive`
    )
VALUES
    (
        "Ducasse",
        123,
        "route des colonies",
        0636656565,
        "ducasse @gmail.com",
        "password",
        1,
        1,
        1
    ),
    (
        "Dupont",
        144,
        "route des montagne",
        0636655555,
        "dupont @gmail.com",
        "cartable",
        11,
        11,
        1
    ),
    (
        "Doe",
        52,
        "Avenue des plages",
        0689145715,
        "doe @gmail.chine",
        "rootroot",
        21,
        21,
        0
    );

INSERT INTO
    familyMembers (
        `idFamily`,
        `firstname`,
        `birthday`,
        `isActive`,
        `avatar`
    )
VALUES
    (
        1,
        "Philipe",
        "1985-07-06 00:00:00",
        1,
        "assets/avatar.png"
    ),
    (
        1,
        "Maire",
        "1987-07-06 00:00:00",
        1,
        "assets/avatar.png"
    ),
    (
        1,
        "Kevin",
        "1900-07-06 00:00:00",
        1,
        "assets/avatar.png"
    ),
    (
        11,
        "Gérard",
        "1980-07-06 00:00:00",
        1,
        "assets/avatar.png"
    ),
    (
        11,
        "Yvette",
        "1989-07-06 00:00:00",
        1,
        "assets/avatar.png"
    ),
    (
        11,
        "Jeremy",
        "1990-07-06 00:00:00",
        1,
        "assets/avatar.png"
    ),
    (
        21,
        "John",
        "1997-07-06 00:00:00",
        1,
        "assets/avatar.png"
    ),
    (
        21,
        "Suzy",
        "1995-07-06 00:00:00",
        1,
        "assets/avatar.png"
    ),
    (
        21,
        "Eric",
        "1600-07-06 00:00:00",
        1,
        "assets/avatar.png"
    );

INSERT INTO
    paymentMethods (`name`)
VALUES
    ("ESPÈCES"),
    ("CHÈQUE"),
    ("CARTE BANCAIRE");

INSERT INTO
    paymentRecords (
        `idPaymentMethod`,
        `checkNumber`,
        `isPaymentActivity`,
        `dateStart`,
        `dateEnd`,
        `amount`,
        `idFamily`,
        `idFamilyMember`,
        `idActivity`
    )
VALUES
    (
        11,
        21654987312178554,
        1,
        "2021-07-06 00:00:00",
        "2023-07-06 00:00:00",
        40,
        11,
        null,
        21
    ),
    (
        1,
        null,
        1,
        "2021-05-06 00:00:00",
        "2022-05-06 00:00:00",
        500,
        null,
        11,
        1
    ),
    (
        21,
        null,
        1,
        "2021-10-06 00:00:00",
        "2022-07-30 00:00:00",
        200,
        21,
        null,
        41
    );

INSERT INTO
    documents (`name`, `url`)
VALUES
    (
        "cadeaux",
        "https://i.ibb.co/Y2NccWZ/20211216-141722.jpg"
    ),
    (
        "enfantsPeintures",
        "https://i.ibb.co/cNKD7Yg/20170707-094557.jpg"
    ),
    (
        "anes",
        "https://i.ibb.co/5WP6BSY/Partages-juin.jpg"
    ),
    (
        "enfantDécoupage",
        "https://i.ibb.co/fnH3m8W/20210929-101149-1.jpg"
    ),
    (
        "réunion",
        "https://i.ibb.co/RgN0YXQ/conf-college.jpg"
    ),
    (
        "papiEnfants",
        "https://i.ibb.co/DQg3pcV/20170614-152502.jpg"
    ),
    (
        "jeux",
        "https://i.ibb.co/q1zjpJD/20210429-171847.jpg"
    ),
    (
        "pilate",
        "https://i.ibb.co/qF9HwB0/IMG-8295.jpg"
    ),
    (
        "gymDouce",
        "https://i.ibb.co/6w8XV9F/gym-douce.jpg"
    ),
    ("gym", "https://i.ibb.co/pznWGpw/IMG-0463.jpg");

INSERT INTO
    linkedDocuments (
        `idDocument`,
        `idEvent`,
        `idCommunication`,
        `idFamilyMember`,
        `idFamily`
    )
VALUES
    (1, 1, null, null, null),
    (11, 1, null, null, null),
    (21, 1, null, null, null),
    (31, 1, null, null, null),
    (41, 11, null, null, null),
    (51, 11, null, null, null),
    (61, 21, null, null, null),
    (71, 21, null, null, null),
    (61, 31, null, null, null),
    (71, 31, null, null, null),
    (81, 41, null, null, null),
    (91, 41, null, null, null);

INSERT INTO
    admins (`firstname`, `lastname`, `email`, `password`)
VALUES
    (
        'Boris',
        'Vian',
        'soireedisco@joke.com',
        'borisetviansontsurunbateau'
    ),
    ('test', 'test', 'test@test.com', 'test');
    
INSERT INTO
    communications (
        `object`,
        `content`,
        `date`,
        `idAdmin`,
        `isBanner`
    )
VALUES
    (
        'Informations',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        "2021-10-06 00:00:00",
        1,
        1
    ),
    (
        'Fermeture',
        'Nous fermerons nos portes du 10 au 20/06',
        "2021-10-06 00:00:00",
        11,
        1
    ),
    (
        'Atelier',
        'Future Atelier parent - enfant',
        "2021-10-06 00:00:00",
        1,
        0
    );

INSERT INTO
    communicationMembers (
        `idFamilyMember`,
        `idCommunication`,
        `idFamily`,
        `isOpened`
    )
VALUES
    (1, 1, 1, 1),
    (21, 11, 1, 0),
    (11, 21, 1, 1);