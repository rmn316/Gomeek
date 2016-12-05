CREATE DATABASE gomeeki DEFAULT CHARACTER SET utf8;

CREATE TABLE locations (
  id INTEGER NOT NULL PRIMARY KEY auto_increment,
  name VARCHAR (64) NOT NULL,
  latitude VARCHAR (16) NOT NULL,
  longitude VARCHAR(16) NOT NULL,
  created DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE tweets (
  id INTEGER NOT NULL PRIMARY KEY auto_increment,
  location_id INTEGER NOT NULL,
  data TEXT NOT NULL COMMENT 'JSON array of tweets',
  created DATETIME NOT NULL
) ENGINE=InnoDB;


GRANT ALL ON gomeeki.* TO 'sqluser'@'%';
FLUSH PRIVILEGES;
