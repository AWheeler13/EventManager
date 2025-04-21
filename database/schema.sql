CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'university', 'rso_admin', 'student') NOT NULL
);

CREATE TABLE Universities (
    university_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    num_students INT,
    website TEXT,
    user_id INT NOT NULL,
    status ENUM('pending', 'active') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE RSOs (
    rso_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    university_id INT NOT NULL,
    rso_admin INT NOT NULL,
    status ENUM('pending', 'active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (university_id) REFERENCES Universities(university_id) ON DELETE CASCADE,
    FOREIGN KEY (rso_admin) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE RSO_Memberships (
    membership_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    rso_id INT NOT NULL,
    status ENUM('pending', 'active') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE, 
    FOREIGN KEY (rso_id) REFERENCES RSOs(rso_id) ON DELETE CASCADE,
    UNIQUE (user_id, rso_id)
);

CREATE TABLE Students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    university_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending', 'active') DEFAULT 'active',
    FOREIGN KEY (university_id) REFERENCES Universities(university_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Buildings (
    building_id INT PRIMARY KEY AUTO_INCREMENT,
    university_id INT,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    FOREIGN KEY (university_id) REFERENCES Universities(university_id) ON DELETE CASCADE
);

CREATE TABLE Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('social', 'fundraising', 'tech talk', 'other') NOT NULL,
    date_time DATETIME NOT NULL,
    building_id INT DEFAULT NULL,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    visibility ENUM('public', 'private', 'rso') NOT NULL,
    university_id INT,
    rso_id INT DEFAULT NULL,
    rso_admin INT NOT NULL,
    FOREIGN KEY (building_id) REFERENCES Buildings(building_id) ON DELETE CASCADE,
    FOREIGN KEY (university_id) REFERENCES Universities(university_id) ON DELETE CASCADE,
    FOREIGN KEY (rso_id) REFERENCES RSOs(rso_id) ON DELETE CASCADE,
    FOREIGN KEY (rso_admin) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE EventComments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE EventRatings (
    rating_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE (event_id, user_id)
);