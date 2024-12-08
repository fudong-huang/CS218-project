CREATE TABLE requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    uId INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    pic VARCHAR(255),
    status ENUM('pending', 'completed') DEFAULT 'pending'
);

-- INSERT INTO requests (uId, item_name, description, pic, last_scan) VALUES (1, 'display cabinet', 'I am looking for a cabinet for my Gundam model kit collections.', '/home/chun/cs-218-project/sample_4.jpeg', '2024-11-25 11:45:51');
INSERT INTO requests (uId, item_name, description, pic) VALUES (1, 'display cabinet', 'I am looking for a cabinet for my Gundam model kit collections.', 'https://cs-218-project-2024.s3.us-east-2.amazonaws.com/sample_2.jpeg');

CREATE TABLE results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT,
    url VARCHAR(255),
    image_url VARCHAR(255),
    score INT,
    FOREIGN KEY (request_id) REFERENCES requests(request_id)
);

INSERT INTO requests (uId, item_name, description, pic, last_scan) VALUES (1, 'coat rack', 'Looking for a standing coat hanger', '/home/chun/cs-218-project/sample_3.jpeg');