DROP DATABASE `pocli`;

CREATE DATABASE `pocli`;

USE `pocli`;

CREATE TABLE `eventDocuments`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idDocument` INT NOT NULL,
    `idEvent` INT NOT NULL
);

CREATE TABLE `communicationMembers`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idFamilyMember` INT NOT NULL,
    `idCommunication` INT NOT NULL
);

CREATE TABLE `admins` (
    `id` INT auto_increment PRIMARY KEY,
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(100) NOT NULL
);

CREATE TABLE `partners` (
    `id` INT auto_increment PRIMARY KEY,
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
    `isOpened` TINYINT(1) NOT NULL,
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
    `description` VARCHAR(255) NOT NULL,
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
    `numberCheck` INT NULL,
    `isPaymentActivity` TINYINT(1) NOT NULL,
    `datePay` DATE NOT NULL,
    `amountPay` INT NOT NULL,
    `idFamily` INT NULL,
    `idFamilyMember` INT NULL,
    `idActivity` INT NOT NULL,
);

CREATE TABLE `familyMembers`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idFamily` INT NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `birthday` DATE NOT NULL,
    `isActive` TINYINT(1) NOT NULL
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
    `abridged` VARCHAR(100) NOT NULL
);

CREATE TABLE `recipients`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `cities`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `zipCode` INT NOT NULL
);

CREATE TABLE `paymentMethods`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
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
    `communicationsMembers`
ADD
    CONSTRAINT `communicationMembers_idcommunications_foreign` FOREIGN KEY(`idCommunication`) REFERENCES `communications`(`id`);

ALTER TABLE
    `communicationsMembers`
ADD
    CONSTRAINT `communicationMembers_idfamilyMember_foreign` FOREIGN KEY(`idFamilyMember`) REFERENCES `familyMembers`(`id`);

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
    `eventDocuments`
ADD
    CONSTRAINT `eventdocuments_iddocument_foreign` FOREIGN KEY(`idDocument`) REFERENCES `documents`(`id`);

ALTER TABLE
    `eventDocuments`
ADD
    CONSTRAINT `eventdocuments_idevent_foreign` FOREIGN KEY(`idEvent`) REFERENCES `events`(`id`);

-- ACTIVITIES
INSERT INTO
    activities (`name`, `category`, `abridged`)
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
        '“Atelier à venir...” Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa',
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
        'Les activités proposées vous permettent, parents et grands-parents, de partager un moment avec vos enfants et petits enfants de 0 à 12 ans',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa',
        null,
        0,
        1000,
        2,
        null
    ),
    (
        10,
        '12/04/10',
        'Moment convivial autour d’une activité partagée : découverte sensorielle, motricité, éveil musical, contes, activité manuelle, sortie nature',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa',
        null,
        1,
        1000,
        1,
        3
    ),
    (
        5,
        '12/12/12',
        'Vous pratiquerez des activités sportives dans une ambiance détendue et conviviale : pilates, gym douce, gym seniors',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perferendis libero ipsa',
        null,
        1,
        500,
        3,
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
        8
    );