CREATE TABLE `eventDocuments`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idDocument` INT NOT NULL,
    `idEvent` INT NOT NULL
);
CREATE TABLE `communicationMembers`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idFamilyMember` INT NOT NULL
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
    `idCommunicationMember` INT NOT NULL,
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
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `text` TEXT NULL,
    `podcastLink` VARCHAR(255) NULL,
    `reservedAdherent` TINYINT(1) NOT NULL,
    `price` INT NULL,
    `idPostType` INT NOT NULL,
    `idActivity` INT NOT NULL
);
CREATE TABLE `paymentRecords`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idPaymentMethod` INT NOT NULL,
    `numberCheck` INT NULL,
    `isPaymentActivity` TINYINT(1) NOT NULL,
    `datePay` DATE NOT NULL,
    `amountPay` INT NOT NULL,
    `idFamily` INT NULL,
    `idFamilyMember` INT NULL
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
    `url` VARCHAR(255) NOT NULL
);
CREATE TABLE `activities`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
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
    `paymentRecords` ADD CONSTRAINT `paymentrecords_idpaymentmethod_foreign` FOREIGN KEY(`idPaymentMethod`) REFERENCES `paymentMethods`(`id`);
ALTER TABLE
    `paymentRecords` ADD CONSTRAINT `paymentrecords_idfamily_foreign` FOREIGN KEY(`idFamily`) REFERENCES `families`(`id`);
ALTER TABLE
    `paymentRecords` ADD CONSTRAINT `paymentrecords_idfamilymember_foreign` FOREIGN KEY(`idFamilyMember`) REFERENCES `familyMembers`(`id`);
ALTER TABLE
    `familyMembers` ADD CONSTRAINT `familymembers_idfamily_foreign` FOREIGN KEY(`idFamily`) REFERENCES `families`(`id`);
ALTER TABLE
    `families` ADD CONSTRAINT `families_idcity_foreign` FOREIGN KEY(`idCity`) REFERENCES `cities`(`id`);
ALTER TABLE
    `families` ADD CONSTRAINT `families_idrecipient_foreign` FOREIGN KEY(`idRecipient`) REFERENCES `recipients`(`id`);
ALTER TABLE
    `familyMemberActivities` ADD CONSTRAINT `familymemberactivities_idactivity_foreign` FOREIGN KEY(`idActivity`) REFERENCES `activities`(`id`);
ALTER TABLE
    `familyMemberActivities` ADD CONSTRAINT `familymemberactivities_idfamilymember_foreign` FOREIGN KEY(`idFamilyMember`) REFERENCES `familyMembers`(`id`);
ALTER TABLE
    `communications` ADD CONSTRAINT `communications_idcommunicationmembers_foreign` FOREIGN KEY(`idCommunicationMembers`) REFERENCES `communicationMembers`(`id`);
ALTER TABLE
    `familyMemberEvents` ADD CONSTRAINT `familymemberevents_idfamilymember_foreign` FOREIGN KEY(`idFamilyMember`) REFERENCES `familyMembers`(`id`);
ALTER TABLE
    `familyMemberEvents` ADD CONSTRAINT `familymemberevents_idevent_foreign` FOREIGN KEY(`idEvent`) REFERENCES `events`(`id`);
ALTER TABLE
    `events` ADD CONSTRAINT `events_idposttype_foreign` FOREIGN KEY(`idPostType`) REFERENCES `postTypes`(`id`);
ALTER TABLE
    `events` ADD CONSTRAINT `events_idactivity_foreign` FOREIGN KEY(`idActivity`) REFERENCES `activities`(`id`);
ALTER TABLE
    `eventDocuments` ADD CONSTRAINT `eventdocuments_iddocument_foreign` FOREIGN KEY(`idDocument`) REFERENCES `documents`(`id`);
ALTER TABLE
    `eventDocuments` ADD CONSTRAINT `eventdocuments_idevent_foreign` FOREIGN KEY(`idEvent`) REFERENCES `events`(`id`);