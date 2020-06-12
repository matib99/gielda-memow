DROP DATABASE IF EXISTS sessions;
CREATE DATABASE sessions;

DROP DATABASE IF EXISTS mememarket;
CREATE DATABASE mememarket;
USE mememarket;

DROP TABLE IF EXISTS memes;
DROP TABLE IF EXISTS prices;
DROP TABLE IF EXISTS users;


create table memes 
(
    id INT(12) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(40) NOT NULL,
    fileurl VARCHAR(1024) NOT NULL,
    price INT(12) UNSIGNED NOT NULL
);

create table users
(
    id INT(12) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(40) NOT NULL
);

create table prices
(
    memeid INT(12) UNSIGNED NOT NULL REFERENCES memes,
    price INT(12) UNSIGNED NOT NULL,
    changedate DATETIME NOT NULL,
    userid INT(12) UNSIGNED NOT NULL REFERENCES users
);

