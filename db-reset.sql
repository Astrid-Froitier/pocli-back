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
    `isOpened` TINYINT(1) NOT NULL DEFAULT false,
    `isTrashed` TINYINT(1) NOT NULL DEFAULT false
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
    `url` VARCHAR(255) NOT NULL
);

CREATE TABLE `familyMemberEvents`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idFamilyMember` INT NOT NULL,
    `idEvent` INT NOT NULL
);

CREATE TABLE `communications`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `object` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
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
    `date` DATETIME NOT NULL,
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
    `avatar` VARCHAR(255) NULL
);

CREATE TABLE `families`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `streetNumber` INT NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phoneNumber` INT NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `idCity` INT NOT NULL,
    `idRecipient` INT NOT NULL
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
    (
        'Pilates',
        'Activité physiques et de Bien-être',
        'physical'
    ),
    (
        'Gym Douce',
        'Activité physiques et de Bien-être',
        'physical'
    ),
    (
        'Gym Seniors',
        'Activité physiques et de Bien-être',
        'physical'
    ),
    (
        'Bien-Être Solo',
        'Activité physiques et de Bien-être',
        'physical'
    ),
    (
        'Bien-Être Duo',
        'Activité physiques et de Bien-être',
        'physical'
    ),
    (
        'Visites de Convivialité',
        'Prévention - Action sociale',
        'social'
    ),
    (
        'Rencontres L.I.S.E',
        'Prévention - Action sociale',
        'social'
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
        '2021-07-06 00:00:00',
        'Les Ateliers Part''Ages permettent de créer du lien et de mixer les générations.',
        'Adultes et enfants partagent une activité dans une ambiance détendue. Les enfants ont entre 0 et 12 ans. Les ateliers sont pour eux des moments de découvertes, d''expériences et de complicité avec les autres et avec son parent. Pour les adultes, ils permettent de sortir de la maison, de partager pleinement un temps avec son enfant, de rencontrer d''autres parents et de partager ses doutes et ses difficultés si besoin. Le cadre bienveillant permet d''y trouver écoute et soutien. Les activités sont variées : découverte sensorielle, peinture, constuction, cuisine, éveil musical, contes, motricité, ... et les ateliers "Fait Maison" pour faire soi même lessive, dentifrice, baume hydratant... Mais l''activité n''est qu''un prétexte à la rencontre !',
        null,
        0,
        100,
        1,
        1
    ),
    (
        10,
        '2021-06-06 00:00:00',
        'Un heureux évènement... suite',
        'Bonjour futur(s) ou jeune(s) parent(s), Suite à mon article écrit dans notre bulletin n°2, dans l’onglet « Parents thèmes », voici l’adresse e-mail sur laquelle vous pourrez directement prendre contact avec moi durant le confinement, si vous le souhaitez : alexia.ecoute.et.soutien.perinatal@gmail.com. Bien à vous !',
        null,
        0,
        1000,
        1,
        11
    ),
    (
        10,
        '2021-05-06 00:00:00',
        'Vous pratiquerez des activités physiques dans une ambiance détendue et conviviale.',
        'Vous renforcerez vos relations avec vos enfants lors de séances de bien être duo parents/enfants : méditation, yoga, massage, balade sensorielle. Vous prendrez du temps pour vous : activités et sorties bien-être solo (méditation, yoga), soirées papote autour d’un verre, …',
        null,
        0,
        1000,
        1,
        21
    ),
    (
        5,
        '2021-04-06 00:00:00',
        'Gym Seniors',
        'Renforcement musculaire, équilibre dynamique, stimulation de la fonction cardia-respiratoire, renforcement abdos fessiers, assouplissement  de la colonne vertébrale, étirement de la chaîne musculaire.',
        null,
        0,
        500,
        1,
        41
    ),
    (
        25,
        '2021-03-06 00:00:00',
        'Bien-être Solo',
        'Cycles de découvertes d’activités relaxantes : méditation, yoga. Sorties bien-être : Calicéo, balade nature, …',
        null,
        0,
        50,
        1,
        51
    ),
    (
        null,
        '2021-10-06 00:00:00',
        'Sur le chemin de Compostelle avec Hervé Pauchon',
        'C’est un chemin mythique qui attire des pèlerins du monde entier. Des pèlerins au sens large avec des motivations pas toujours religieuses. Bien des raisons peuvent mener aux chemins de Saint-Jacques-de-Compostelle. On marche vers la capitale de la Galice pour chercher Dieu ou pour retrouver foi en l’humanité, pour ralentir ou pour garder la forme, pour reprendre pied dans l’existence ou pour lâcher prise, pour rencontrer l’autre ou pour se retrouver soi et pour mille autres raisons encore.',
        'https://www.radiofrance.fr/franceinter/podcasts/le-temps-d-un-bivouac/le-temps-d-un-bivouac-du-mardi-05-juillet-2022-4349919',
        1,
        null,
        21,
        null
    ),
    (
        null,
        '2022-06-21 00:00:00',
        'Fête de la Musique 2022 !',
        'Une fête écourtée à cause des conditions météorologiques mais de très beaux moments partagés avec les autres bénévoles des associations partenaires.\RV l''année prochaine !',
        null,
        0,
        null,
        11,
        null
    ),
    (
        null,
        '2022-09-05 00:00:00',
        'Rentrée de Septembre',
        'Toutes les activités reprendront la semaine du 5 septembre :\Pilates : lundi de 19h à 20h, salle des fêtes d''Espiet.\Gym Séniors : mardi de 11h15 à 12h15, salle des fêtes de St Quentin de Baron.\Douce : jeudi de 18h à 19h, salle des fêtes de St Quentin de Baron.\Ateliers Part''Ages : lundi, mardi et jeudi de 9h à 11h Salle des fêtes de St Quentin de Baron et mercredi de 9h30 à 11h30 : salle des fêtes d''Espiet.\Informations et inscriptions à partir du 16 août au 07 64 15 27 11',
        null,
        0,
        null,
        11,
        null
    ),
    (
        null,
        '2022-07-02 00:00:00',
        'Château de Bisqueytan',
        'Alison nous a ouvert les portes du château pour une balade ludique et conviviale ! 
        Petits et grands ont apprécié cette visite à la recherche des cailloux dorés ! 
        (photos à venir)',
        null,
        0,
        null,
        11,
        null
    ),
    (
        null,
        '2022-07-14 00:00:00',
        'Un lieu dédié pour PoCLi',
        'Depuis quelques années, avec nos partenaires, nous travaillons sur un lieu dédié à nos activités. Ce lieu d''activités est indispensable pour notre Espace de Vie Sociale et le développement de nos actions (et nous avons plein de belles idées !). 
        Nous avons hâte de nous poser mais resterons au plus près des habitants du territoire en maintenant des actions "hors les murs". 
        Le projet d''installation à l''ancienne Gare d''Espiet est en réflexion avec les partenaires et les élus. Nous vous informerons de l''avancée du projet à la rentrée de septembre.',
        null,
        0,
        null,
        11,
        null
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
    ("Aucun");

INSERT INTO
    families (
        `name`,
        `streetNumber`,
        `address`,
        `phoneNumber`,
        `email`,
        `password`,
        `idCity`,
        `idRecipient`
    )
VALUES
    (
        "Ducasse",
        123,
        "route des colonies",
        0636656565,
        "ducasse@gmail.com",
        "password",
        1,
        1
    ),
    (
        "Dupont",
        144,
        "route des montagnes",
        0636655555,
        "dupont@gmail.com",
        "password",
        11,
        11
    ),
    (
        "Snow",
        52,
        "Avenue des plages",
        0689145715,
        "snow@gmail.com",
        "password",
        21,
        21
    );

INSERT INTO
    familyMembers (
        `idFamily`,
        `firstname`,
        `birthday`,
        `avatar`
    )
VALUES
    (
        1,
        "Philipe",
        "1985-07-06 00:00:00",
        null
    ),
    (
        1,
        "Maire",
        "1987-07-06 00:00:00",
        null
    ),
    (
        1,
        "Kevin",
        "1900-07-06 00:00:00",
        null
    ),
    (
        11,
        "Gérard",
        "1980-07-06 00:00:00",
        null
    ),
    (
        11,
        "Yvette",
        "1989-07-06 00:00:00",
        null
    ),
    (
        11,
        "Jeremy",
        "1990-07-06 00:00:00",
        null
    ),
    (
        21,
        "John",
        "1997-07-06 00:00:00",
        null
    ),
    (
        21,
        "Suzy",
        "1995-07-06 00:00:00",
        null
    ),
    (
        21,
        "Eric",
        "1600-07-06 00:00:00",
        null
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
        "2021-07-06 00:00:00",
        "2023-07-06 00:00:00",
        40,
        11,
        null,
        null
    ),
    (
        1,
        null,
        "2021-05-06 00:00:00",
        "2022-05-06 00:00:00",
        500,
        1,
        11,
        1
    ),
    (
        21,
        null,
        "2021-10-06 00:00:00",
        "2022-07-30 00:00:00",
        200,
        1,
        21,
        41
    );

INSERT INTO
    documents (`name`, `url`)
VALUES
    (
        "avatar-rabbit",
        "https://i.ibb.co/svD1v3p/avatar-rabbit.png"
    ),
    (
        "avatar-deer",
        "https://i.ibb.co/Ld3T7NL/avatar-deer.png"
    ),
    (
        "avatar-panda",
        "https://i.ibb.co/Tr9b2Dj/avatar-panda.png"
    ),
    (
        "avatar-fox",
        "https://i.ibb.co/RNx3fzV/avatar-fox.png"
    ),
    (
        "avatar-bear",
        "https://i.ibb.co/vms0362/avatar-bear.png"
    ),
    (
        "avatar-owl",
        "https://i.ibb.co/SKWJ9V3/avatar-rabbit.png"
    ),
    (
        "avatar-beaver",
        "https://i.ibb.co/xD0dgt6/avatar-beaver.png"
    ),
    (
        "avatar-raccoon",
        "https://i.ibb.co/4NTLHQ1/avatar-raccoon.png"
    ),
    (
        "cadeaux",
        "https://i.ibb.co/Y2NccWZ/20211216-141722.jpg"
    ),
    (
        "enfants-peinture",
        "https://i.ibb.co/cNKD7Yg/20170707-094557.jpg"
    ),
    (
        "anes",
        "https://i.ibb.co/5WP6BSY/Partages-juin.jpg"
    ),
    (
        "enfants-atelier-découpage",
        "https://i.ibb.co/fnH3m8W/20210929-101149-1.jpg"
    ),
    (
        "réunion",
        "https://i.ibb.co/RgN0YXQ/conf-college.jpg"
    ),
    (
        "papi-enfants",
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
        "gym-douce",
        "https://i.ibb.co/6w8XV9F/gym-douce.jpg"
    ),
    ("gym", "https://i.ibb.co/pznWGpw/IMG-0463.jpg"),
    (
        "Compostelle",
        "https://i.ibb.co/pwzqjgT/560x315-img-0734002.webp"
    ),
    (
        "collage",
        "https://i.ibb.co/Cw026dh/collage-actions-Po-CLi.png"
    ),
    (
        "gare",
        "https://i.ibb.co/Q8XbN6b/Photos-gare.jpg"
    ),
    (
        "fête de la musique",
        "https://i.ibb.co/zbqgZYG/Resized-1656009810667-0-Resized-20220622-182830-2316.jpg"
    );

INSERT INTO
    linkedDocuments (
        `idDocument`,
        `idEvent`,
        `idCommunication`,
        `idFamilyMember`,
        `idFamily`
    )
VALUES
    (91, 1, null, null, null),
    (101, 1, null, null, null),
    (111, 1, null, null, null),
    (121, 1, null, null, null),
    (81, 11, null, null, null),
    (131, 11, null, null, null),
    (141, 11, null, null, null),
    (151, 21, null, null, null),
    (161, 21, null, null, null),
    (171, 31, null, null, null),
    (161, 41, null, null, null),
    (181, 51, null, null, null),
    (211, 61, null, null, null),
    (191, 71, null, null, null),
    (201, 91, null, null, null)
    (191, 71, null, null, null),
    (181, null, null, null, 1),
    (191, null, null, null, 1);

INSERT INTO
    admins (`firstname`, `lastname`, `email`, `password`)
VALUES
    (
        'Amandine',
        'SOLER',
        'amandinesoler@outlook.fr',
        'pocli12345'
    ),
    ('Emeline', 'CHRUN', 'emelinechrun@gmail.com', 'pocli12345');

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
        0
    ),
    (
        'Fermeture',
        'Nous fermerons nos portes du 10 au 20/06',
        "2021-10-06 00:00:00",
        11,
        0
    ),
    (
        'Atelier',
        'Future Atelier parent - enfant',
        "2021-10-06 00:00:00",
        1,
        0
    ),
        (
        'Nouveau site web',
        'Nous avons le plaisir de vous annoncer que notre nouveau site web sera accessible dès le 30/07/22',
        "2022-07-30 00:00:00",
        1,
        1
    ),
        (
        'Vacances',
        'PoCLi vous souhaite à toutes et tous de très belles vacances d''été',
        "2022-07-01 00:00:00",
        1,
        1
    ),
    (
        "Bienvenue !",
        "L'équipe PoCLi vous souhaite la bienvenue dans votre espace personnel ! Vous pouvez désormais accèder à tous nos évènements sans attendre, vous inscrire, nous contacter et bien plus encore. Laissez-vous guider par notre magnifique site internet pour y découvrir un contenu des plus interressant ;)",
        "2021-10-06 00:00:00",
        1,
        0
    );

INSERT INTO
    communicationMembers (
        `idFamilyMember`,
        `idCommunication`,
        `idFamily`,
        `isOpened`,
        `isTrashed`
    )
VALUES
    (1, 1, 1, 1, 0),
    (21, 11, 1, 0, 0),
    (1, 51, 1, 0, 0),
    (11, 21, 1, 1, 1);