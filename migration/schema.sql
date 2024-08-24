-- schema.sql
CREATE TABLE IF NOT EXISTS sql7727455.pet_status (
   id int NOT NULL AUTO_INCREMENT,
   userId varchar(36) NOT NULL,
   petId int NOT NULL,
   PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sql7727455.users (
   id int NOT NULL AUTO_INCREMENT,
   email varchar(45) NOT NULL,
   password varchar(70) NOT NULL,
   phone_number varchar(10) DEFAULT NULL,
   first_name varchar(45) NOT NULL,
   last_name varchar(45) NOT NULL,
   PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sql7727455.pets (
   id int NOT NULL AUTO_INCREMENT,
   name varchar(45) NOT NULL,
   adoption_status varchar(45) NOT NULL,
   type varchar(45) NOT NULL,
   height float NOT NULL,
   weight float NOT NULL,
   color varchar(45) NOT NULL,
   bio varchar(45) NOT NULL,
   hypoallergenic tinyint(1) DEFAULT '0',
   dietary_restrictions varchar(45) NOT NULL,
   breed varchar(45) NOT NULL,
   imgFile varchar(200) NOT NULL,
   adoptedBy varchar(36) DEFAULT NULL,
   PRIMARY KEY (id)
);
