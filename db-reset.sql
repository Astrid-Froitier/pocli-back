DROP DATABASE `pocli`;

CREATE DATABASE `pocli`;

USE `pocli`;

CREATE TABLE `linkedDocuments`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idDocument` INT NOT NULL,
    `date` DATETIME NOT NULL DEFAULT NOW(),
    `idActivity` INT NULL,
    `idEvent` INT NULL,
    `idFamilyMember` INT NULL,
    `idFamily` INT NULL,
    `isOpened` TINYINT(1) NOT NULL DEFAULT 0
);

CREATE TABLE `communicationMembers`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idFamily` INT NULL,
    `idFamilyMember` INT NULL,
    `idActivity` INT NULL,
    `idCommunication` INT NOT NULL,
    `isOpened` TINYINT(1) NOT NULL DEFAULT 0,
    `isTrashed` TINYINT(1) NOT NULL DEFAULT 0,
    `isBanner` TINYINT(1) NOT NULL DEFAULT 0
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
    `name` VARCHAR(50) NOT NULL,
    `logo` VARCHAR(255) NOT NULL,
    `link` VARCHAR(255) NOT NULL
);

CREATE TABLE `pocliMembers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `firstname` VARCHAR(50) NOT NULL,
    `lastname` VARCHAR(50) NOT NULL,
    `function` VARCHAR(50) NOT NULL,
    `url` VARCHAR(255) NOT NULL
);

CREATE TABLE `familyMemberEvents`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idFamilyMember` INT NOT NULL,
    `idEvent` INT NOT NULL
);

CREATE TABLE `communications`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `date` DATETIME NOT NULL DEFAULT NOW(),
    `object` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `idAdmin` INT NOT NULL
);

CREATE TABLE `events`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idPostType` INT NOT NULL,
    `idActivity` INT NULL,
    `date` DATETIME NOT NULL DEFAULT NOW(),
    `description` VARCHAR(100) NOT NULL,
    `text` TEXT NULL,
    `podcastLink` VARCHAR(255) NULL,
    `numberParticipantsMax` INT NULL,
    `reservedAdherent` TINYINT(1) NOT NULL,
    `price` INT NULL
);

CREATE TABLE `paymentRecords`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idFamily` INT NOT NULL,
    `idFamilyMember` INT NULL,
    `idActivity` INT NULL,
    `idPaymentMethod` INT NOT NULL,
    `checkNumber` VARCHAR(50) NULL,
    `amount` INT NOT NULL,
    `dateStart` DATETIME NOT NULL,
    `dateEnd` DATETIME NOT NULL
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
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `streetNumber` INT NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `idCity` INT NOT NULL,
    `phoneNumber` INT NOT NULL,
    `idRecipient` INT NOT NULL
);

CREATE TABLE `postTypes`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `documentTypes`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `documents`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `idDocumentType` INT NOT NULL
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
    `communicationMembers`
ADD
    CONSTRAINT `communicationmembers_idactivity_foreign` FOREIGN KEY(`idActivity`) REFERENCES `activities`(`id`);

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
    `documents`
ADD
    CONSTRAINT `documents_iddocumenttype_foreign` FOREIGN KEY(`idDocumentType`) REFERENCES `documentTypes`(`id`);

ALTER TABLE
    `linkedDocuments`
ADD
    CONSTRAINT `linkeddocuments_idevent_foreign` FOREIGN KEY(`idEvent`) REFERENCES `events`(`id`);

ALTER TABLE
    `linkedDocuments`
ADD
    CONSTRAINT `linkeddocuments_idfamily_foreign` FOREIGN KEY(`idFamily`) REFERENCES `families`(`id`);

ALTER TABLE
    `linkedDocuments`
ADD
    CONSTRAINT `linkeddocuments_idfamilymember_foreign` FOREIGN KEY(`idFamilyMember`) REFERENCES `familyMembers`(`id`);

ALTER TABLE
    `linkedDocuments`
ADD
    CONSTRAINT `linkeddocuments_idactivity_foreign` FOREIGN KEY(`idActivity`) REFERENCES `activities`(`id`);

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

-- DOCUMENT TYPES
INSERT INTO
    documentTypes (`name`)
VALUES
    ('IMAGE'),
    ('PODCAST'),
    ('PDF');

-- POCLI MEMBERS
INSERT INTO
    pocliMembers (`firstname`, `lastname`, `function`, `url`)
VALUES
    (
        'Michaël',
        'HOUSSIER',
        'Président',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Membres%20du%20CA%20et%20salari%C3%A9s%2FMichae%CC%88l%20HOUSSIER.JPG?alt=media&token=8db055d3-d495-42cd-b02e-a117c37e1c23'
    ),
    (
        'Emeline',
        'CHRUN',
        'Coordinatrice',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Membres%20du%20CA%20et%20salari%C3%A9s%2FEmeline%20CHRUN%2C%20coordinatrice.jpg?alt=media&token=2d979d8d-8d35-4d5c-bd18-56d800dab021'
    ),
    (
        'Amandine',
        'SOLER',
        'Secrétaire',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Membres%20du%20CA%20et%20salari%C3%A9s%2FAmandine%20SOLER.jpg?alt=media&token=87e0e5c6-d170-452e-8434-9c62fad98614'
    ),
    (
        'Anne-Michèle',
        'LAIZAIN',
        'Animatrice',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Membres%20du%20CA%20et%20salari%C3%A9s%2FAnne%20Miche%CC%80le%20LAIZAIN%2C%20animatrice.jpg?alt=media&token=955984da-c1d2-47b5-8c6e-57311c5dd522'
    ),
    (
        'Sandrine',
        'LARMET',
        'Membre',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Membres%20du%20CA%20et%20salari%C3%A9s%2FSandrine%20LARMET.jpg?alt=media&token=af6cf9fe-ffe0-4a0f-8357-f2789c1f6487'
    ),
    (
        'Marie-Françoise',
        'PARENTEAU',
        'Membre',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Membres%20du%20CA%20et%20salari%C3%A9s%2FMarie%20Franc%CC%A7oise%20PARENTEAU.jpg?alt=media&token=dd8eede3-e697-4a13-b52f-86ca732aa246'
    ),
    (
        'Sylvie',
        'POMMIER',
        'Membre',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Membres%20du%20CA%20et%20salari%C3%A9s%2FSylvie%20POMMIER.jpg?alt=media&token=2f51c2a8-e619-4a1d-a89b-41e3c02a1a21'
    ),
    (
        'Alexia',
        'DHELIN',
        'Membre',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Membres%20du%20CA%20et%20salari%C3%A9s%2FAlexia%20DHELLIN.jpg?alt=media&token=5f93785f-b016-4187-9fa7-f0f83be9a356'
    ),
    (
        'Chrystelle',
        'DEL RIO',
        'Membre',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Membres%20du%20CA%20et%20salari%C3%A9s%2FChystelle%20DEL%20RIO.jpg?alt=media&token=b10ac21b-66dc-4a27-abe7-f36bddee4004'
    ),
    (
        'Christine',
        'HOUQUES',
        'Membre',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Membres%20du%20CA%20et%20salari%C3%A9s%2FChristine%20HOUQUES.jpg?alt=media&token=04e0b564-fe11-4c42-9c15-10567066a545'
    );

-- PARTNERS
INSERT INTO
    partners (`name`, `logo`, `link`)
VALUES
    (
        'Ville de Branne',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Logos%20partenaires%2FBranne.png?alt=media&token=3a6fabc4-2b14-44ae-bdc6-6b61ff78ceff',
        'https://www.mairie-branne.fr/'
    ),
    (
        'CAF',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Logos%20partenaires%2FCAF.jpg?alt=media&token=cac5f7cb-11c8-4f81-bcd9-3d8fde43c0bf',
        'https://www.caf.fr/'
    ),
    (
        'Castillon-Pujols',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Logos%20partenaires%2Flogo%20castillon-pujols.jpeg?alt=media&token=64aa3d62-7ed9-45bd-a0ce-24511425ad07',
        'https://www.castillonpujols.fr/'
    ),
    (
        'Département Gironde',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Logos%20partenaires%2FDepartement%20Gironde.png?alt=media&token=51265cb2-7a37-4c4c-8478-dea9e5043999',
        'https://www.gironde.fr/'
    ),
    (
        'La Cali',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Logos%20partenaires%2FLa%20CALI.png?alt=media&token=ceb06e66-506f-424d-bd4b-80523813fafd',
        'https://www.lacali.fr/'
    ),
    (
        'MSA',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Logos%20partenaires%2Flogo%20msa.png?alt=media&token=8bc290a2-d843-41ff-adcd-2db1aa6a1aa8',
        'https://www.msa.fr/'
    ),
    (
        'Mairie Espiet',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Logos%20partenaires%2FMairie%20Espiet.png?alt=media&token=f6bdc036-eb24-4af8-8686-d4351f1b970d',
        'http://www.espiet.fr/'
    ),
    (
        'Mairie de St Quentin de Baron',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Logos%20partenaires%2FMairie%20de%20St%20Quentin%20de%20B.png?alt=media&token=a056eff2-cfbc-47bd-9d45-a2812ee4f2b8',
        'https://saint-quentin-de-baron.fr/'
    ),
    (
        'Nérigean',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Logos%20partenaires%2FNe%CC%81rigean.jpg?alt=media&token=d2040d3c-e49e-466e-9e04-97c1d065cd89',
        'https://nerigean.fr/'
    ),
    (
        'Nouvelle-Aquitaine',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Logos%20partenaires%2FNouvelle%20Aquitaine.jpg?alt=media&token=36cde2b5-7497-4705-809b-ebcb88107a2a',
        'https://www.nouvelle-aquitaine.fr/'
    ),
    (
        'REAAP',
        'https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Logos%20partenaires%2FREAAP.jpg?alt=media&token=0cc50762-03d4-486a-a9b6-6f37246c6245',
        ''
    );

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
        null,
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

-- CITIES
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

-- RECIPIENTS
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
        "$argon2id$v=19$m=65536,t=5,p=1$908LM5sH+jGbyz0rnR7jFA$M+N/D6k/qYXARufJTkGPD62IY5/XSVQV7cVRKtPXJDc",
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
    ),
    (
        "Larroche",
        13,
        "Avenue de la Marne",
        1234567890,
        "larrochefamily@gmail.com",
        "$argon2id$v=19$m=65536,t=5,p=1$NcJ0hlZt99HkDMLWmPh2qA$/NvLUx+SX/dCVCleNnLSETvz320RGzj98NRNPnjU2GE",
        871,
        11
    );

-- FAMILY MEMBERS
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
        "Boris",
        "1987-07-06 00:00:00",
        null
    ),
    (
        1,
        "Thomas",
        "1973-07-06 00:00:00",
        null
    ),
    (
        1,
        "André",
        "1980-07-06 00:00:00",
        null
    ),
    (
        11,
        "Emeline",
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
        "Lisa",
        "1995-07-06 00:00:00",
        null
    ),
    (
        21,
        "Eric",
        "1600-07-06 00:00:00",
        null
    ),
    (
        1,
        "Paul",
        "1995-07-06 00:00:00",
        null
    ),
    (
        1,
        "Pascal",
        "1959-07-06 00:00:00",
        null
    ),
    (
        1,
        "Jacques",
        "1965-07-06 00:00:00",
        null
    );

-- PAYMENT METHODS
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
        "21654987312178554",
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
    ),
    (
        21,
        null,
        "2021-10-05 22:00:00",
        "2022-07-29 22:00:00",
        50,
        1,
        21,
        1
    ),
    (
        21,
        null,
        "2021-10-05 22:00:00",
        "2022-07-29 22:00:00",
        50,
        1,
        11,
        11
    ),
    (
        21,
        null,
        "2021-10-05 22:00:00",
        "2022-07-29 22:00:00",
        50,
        1,
        31,
        1
    ),
    (
        21,
        null,
        "2021-10-05 22:00:00",
        "2022-07-29 22:00:00",
        50,
        1,
        1,
        1
    ),
    (
        11,
        "4543987312178554",
        "2021-10-05 22:00:00",
        "2022-07-29 22:00:00",
        500,
        1,
        null,
        null
    ),
    (
        21,
        null,
        "2021-10-05 22:00:00",
        "2022-07-29 22:00:00",
        50,
        1,
        101,
        1
    );

-- DOCUMENTS
INSERT INTO
    documents (`name`, `url`, `idDocumentType`)
VALUES
    (
        "avatar-rabbit",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Donn%C3%A9es%20serveur%20-%20ne%20pas%20modifier%2FAvatars%2Favatar-rabbit.png?alt=media&token=fe208f96-05fc-4034-85f8-a4c40d7fafb6",
        1
    ),
    (
        "avatar-deer",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Donn%C3%A9es%20serveur%20-%20ne%20pas%20modifier%2FAvatars%2Favatar-deer.png?alt=media&token=c08d7f1f-cbe2-44c3-812e-2f93faaae6a1",
        1
    ),
    (
        "avatar-panda",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Donn%C3%A9es%20serveur%20-%20ne%20pas%20modifier%2FAvatars%2Favatar-panda.png?alt=media&token=e809e19b-a498-4d4e-83a1-9b83d27d920f",
        1
    ),
    (
        "avatar-fox",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Donn%C3%A9es%20serveur%20-%20ne%20pas%20modifier%2FAvatars%2Favatar-fox.png?alt=media&token=937eb25b-c25e-49b0-91b8-10ac93abe083",
        1
    ),
    (
        "avatar-bear",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Donn%C3%A9es%20serveur%20-%20ne%20pas%20modifier%2FAvatars%2Favatar-bear.png?alt=media&token=5477cf9b-fcb1-461b-8881-c1b4b4a1d97d",
        1
    ),
    (
        "avatar-owl",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Donn%C3%A9es%20serveur%20-%20ne%20pas%20modifier%2FAvatars%2Favatar-owl.png?alt=media&token=b82a795b-7915-4643-b5ac-b96be3791d76",
        1
    ),
    (
        "avatar-beaver",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Donn%C3%A9es%20serveur%20-%20ne%20pas%20modifier%2FAvatars%2Favatar-beaver.png?alt=media&token=9fdc7e51-7e1f-4404-90d7-5a27b89c26c9",
        1
    ),
    (
        "avatar-raccoon",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Donn%C3%A9es%20serveur%20-%20ne%20pas%20modifier%2FAvatars%2Favatar-raccoon.png?alt=media&token=2215a583-ce33-4d84-96df-396d5badb7ee",
        1
    ),
    (
        "cadeaux",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20fictifs%2F20211216-141722.jpeg?alt=media&token=0430b50c-2cb9-4a6a-a015-3253ec9272e7",
        1
    ),
    (
        "enfants-peinture",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20fictifs%2F20170707-094557.jpeg?alt=media&token=afac2feb-72f2-49de-83d9-2ff3417798ed",
        1
    ),
    (
        "ânes",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20fictifs%2FPartages-juin.jpeg?alt=media&token=ef90b5a6-d3c4-4e5e-8e01-e683d05ef264",
        1
    ),
    (
        "enfants-atelier-découpage",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20fictifs%2F20210929-101149-1.jpeg?alt=media&token=940cfc04-96d2-4e94-8db4-b95ca5beffca",
        1
    ),
    (
        "réunion",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20fictifs%2Fconf-college.jpeg?alt=media&token=124711d3-77ab-4331-82c3-47dfe2877b57",
        1
    ),
    (
        "papi-enfants",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20fictifs%2F20170614-152502.jpeg?alt=media&token=694e3758-1f2f-45dc-856d-b2c88aef4a8f",
        1
    ),
    (
        "jeux",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20fictifs%2F20210429-171847.jpeg?alt=media&token=ec23aef0-0e20-4be9-857a-5c16da493ccc",
        1
    ),
    (
        "pilate",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20fictifs%2FIMG-8295.jpeg?alt=media&token=4db1b26b-8108-4c7b-870b-a1ec9b1911be",
        1
    ),
    (
        "gym-douce",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20fictifs%2Fgym-douce.jpeg?alt=media&token=0044e73c-20a3-42f0-b61d-7aeb4a5fc229",
        1
    ),
    (
        "gym",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20fictifs%2FIMG-0463.jpeg?alt=media&token=7462bfff-af8d-47fc-a955-f68e0d8a03a5",
        1
    ),
    (
        "Compostelle",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20fictifs%2F560x315-img-0734002.webp?alt=media&token=0250565d-1d17-4aec-8e07-5a48a0c091f7",
        1
    ),
    (
        "collage",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20r%C3%A9els%2Fcollage-actions-Po-CLi.png?alt=media&token=bbbda796-a419-4a8d-a026-5c58aeb8cee3",
        1
    ),
    (
        "gare",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20r%C3%A9els%2FPhotos-gare.jpeg?alt=media&token=f36bfffd-670c-4b66-b9b2-55e7718b1490",
        1
    ),
    (
        "fête de la musique",
        "https://firebasestorage.googleapis.com/v0/b/pocli-bbb50.appspot.com/o/Ev%C3%A8nements%2FWild%20-%20%C3%89v%C3%A9nements%20r%C3%A9els%2FResized-1656009810667-0-Resized-20220622-182830-2316.jpeg?alt=media&token=869c3b08-95a0-44ab-a1d1-d46c026f6694",
        1
    );

-- LINKED DOCUMENTS
INSERT INTO
    linkedDocuments (
        `idDocument`,
        `idActivity`,
        `idEvent`,
        `idFamilyMember`,
        `idFamily`
    )
VALUES
    (91, null, 1, null, null),
    (101, null, 1, null, null),
    (111, null, 1, null, null),
    (121, null, 1, null, null),
    (81, null, 11, null, null),
    (131, null, 11, null, null),
    (141, null, 11, null, null),
    (151, null, 21, null, null),
    (161, null, 21, null, null),
    (171, null, 31, null, null),
    (161, null, 41, null, null),
    (181, null, 51, null, null),
    (211, null, 61, null, null),
    (191, null, 71, null, null),
    (201, null, 91, null, null),
    (181, null, null, null, 1),
    (191, null, null, null, 1);

-- ADMINS
INSERT INTO
    admins (
        `firstname`,
        `lastname`,
        `email`,
        `password`
    )
VALUES
    (
        "Amandine",
        "SOLER",
        "amandinesoler@outlook.fr",
        "$argon2id$v=19$m=65536,t=5,p=1$koO9GAR2k9OXTS5QP6oBtg$sng/K9qtQTJl1FDfMmC1bDUAA/xKMPliu3SPQg8Wnj0"
    ),
    (
        "Emeline",
        "CHRUN",
        "emelinechrun@gmail.com",
        "testtest"
    );

-- COMMUNICATIONS
INSERT INTO
    communications (
        `object`,
        `content`,
        `date`,
        `idAdmin`
    )
VALUES
    (
        'Informations',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        "2021-10-06 00:00:00",
        1
    ),
    (
        'Fermeture',
        'Nous fermerons nos portes du 10 au 20/06',
        "2021-10-06 00:00:00",
        11
    ),
    (
        'Atelier',
        'Future Atelier parent - enfant',
        "2021-10-06 00:00:00",
        1
    ),
    (
        'Nouveau site web',
        'Nous avons le plaisir de vous annoncer que notre nouveau site web sera accessible dès le 30/07/22',
        "2022-07-30 00:00:00",
        1
    ),
    (
        'Vacances',
        'PoCLi vous souhaite à toutes et tous de très belles vacances d''été',
        "2022-07-01 00:00:00",
        1
    ),
    (
        "Bienvenue !",
        "L'équipe PoCLi vous souhaite la bienvenue dans votre espace personnel ! Vous pouvez désormais accèder à tous nos évènements sans attendre, vous inscrire, nous contacter et bien plus encore. Laissez-vous guider par notre magnifique site internet pour y découvrir un contenu des plus interressant ;)",
        "2021-10-06 00:00:00",
        1
    );

-- COMMUNICATION MEMBERS
INSERT INTO
    communicationMembers (
        `idFamilyMember`,
        `idActivity`,
        `idCommunication`,
        `idFamily`,
        `isOpened`,
        `isTrashed`,
        `isBanner`
    )
VALUES
    (1, null, 1, 1, 1, 0, 0),
    (21, null, 11, 1, 0, 0, 0),
    (null, null, 51, 1, 0, 0, 0),
    (null, null, 21, 1, 1, 1, 0),
    (null, null, 31, null, 0, 0, 1),
    (null, null, 41, null, 0, 0, 1);