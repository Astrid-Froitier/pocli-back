CREATE TABLE paymentMethods(
id INT auto_increment PRIMARY KEY,
name VARCHAR(100) NOT NULL);

CREATE TABLE cities(
id INT auto_increment PRIMARY KEY,
name VARCHAR(100) NOT NULL,
zipCode INT NOT NULL);

CREATE TABLE recipients(
id INT auto_increment PRIMARY KEY,
name VARCHAR(100) NOT NULL);

CREATE TABLE activities(
id INT auto_increment PRIMARY KEY,
name VARCHAR(100) NOT NULL);

CREATE TABLE postTypes(
id INT auto_increment PRIMARY KEY,
name VARCHAR(100) NOT NULL);

CREATE TABLE partners(
id INT auto_increment PRIMARY KEY,
name VARCHAR(100) NOT NULL,
logo VARCHAR(100) NOT NULL,
url VARCHAR(100) NOT NULL);

CREATE TABLE admins(
id INT auto_increment PRIMARY KEY,
firstname VARCHAR(100) NOT NULL,
lastname VARCHAR(100) NOT NULL,
email VARCHAR(255) NOT NULL,
password VARCHAR(100) NOT NULL);

CREATE TABLE families(
id INT auto_increment PRIMARY KEY,
name VARCHAR(100) NOT NULL,
streetNumber INT NOT NULL,
address VARCHAR(150) NOT NULL,
phoneNumber INT NOT NULL,
email VARCHAR(255) NOT NULL,
password VARCHAR(100) NOT NULL,
idCity INT NOT NULL,
CONSTRAINT fk_families_city
FOREIGN KEY(idCity)
REFERENCES cities(id),
idRecipient INT NOT NULL,
CONSTRAINT fk_families_recipient
FOREIGN KEY(idRecipient)
REFERENCES recipients(id));

CREATE TABLE familyMembers(
id INT auto_increment PRIMARY KEY,
idFamily INT NOT NULL,
CONSTRAINT fk_familyMembers_family
FOREIGN KEY (idFamily)
REFERENCES families(id),
firstName VARCHAR(100) NOT NULL,
birthday DATE NOT NULL,
isActive BOOL NOT NULL);

CREATE TABLE paymentRecords(
id INT auto_increment PRIMARY KEY,
idPaymentMethod INT NOT NULL,
CONSTRAINT fk_paymentRecords_paymentMethod
FOREIGN KEY (idPaymentMethod)
REFERENCES paymentMethods(id),
numberCheck INT,
isPaymentActivity BOOL NOT NULL, 
datePay DATE NOT NULL,
amountPay INT NOT NULL,
idFamily INT,
CONSTRAINT fk_paymentRecords_family
FOREIGN KEY (idFamily)
REFERENCES families(id),
idFamilyMember INT,
CONSTRAINT fk_paymentRecords_familiyMember
FOREIGN KEY (idFamilyMember)
REFERENCES familyMembers(id));

CREATE TABLE familyMemberActivities(
id INT auto_increment PRIMARY KEY,
name VARCHAR(100) NOT NULL,
idActivity INT NOT NULL,
CONSTRAINT fk_familyMemberActivities_activity
FOREIGN KEY(idActivity)
REFERENCES activities(id), 
idFamilyMember INT NOT NULL,
CONSTRAINT fk_familyMemberActivities_familyMember
FOREIGN KEY(idFamilyMember)
REFERENCES familyMembers(id));

CREATE TABLE events(
id INT auto_increment PRIMARY KEY,
numberParticipantsMax INT,
name VARCHAR(255) NOT NULL,
text VARCHAR(255),
imageLinks VARCHAR(255),
podcastLink VARCHAR(255),
reservedAdherent BOOL NOT NULL,
price INT,
isLoged BOOL NOT NULL,
idPostType INT NOT NULL,
CONSTRAINT fk_events_postType
FOREIGN KEY (idPostType)
REFERENCES postTypes(id),
idActivity INT NOT NULL,
CONSTRAINT fk_events_activity
FOREIGN KEY (idActivity)
REFERENCES activities(id));

CREATE TABLE familyMemberEvents(
id INT auto_increment PRIMARY KEY,
idFamilyMember INT NOT NULL,
CONSTRAINT fk_familyMemberEvents_familyMember
FOREIGN KEY (idFamilyMember)
REFERENCES familyMembers(id),
idEvent INT NOT NULL,
CONSTRAINT fk_familyMemberEvents_events
FOREIGN KEY (idEvent)
REFERENCES events(id));