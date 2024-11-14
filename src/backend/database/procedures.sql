USE FinalProj;

DELIMITER //

CREATE PROCEDURE user_login(IN first_name VARCHAR(64), IN last_name VARCHAR(64), IN pass VARCHAR(256), OUT uid INT)
BEGIN
    SELECT user_id INTO uid 
    FROM User 
    WHERE first_name = first_name AND last_name = last_name AND password = pass;
END //

DELIMITER ;



DELIMITER //

CREATE PROCEDURE user_signup(IN first_name VARCHAR(64), IN last_name VARCHAR(64), IN pass VARCHAR(256), OUT uid INT)
BEGIN
    DECLARE max_id INT;
    SELECT MAX(user_id) INTO max_id FROM User;
    SET uid = max_id + 1;
    INSERT INTO User(user_id, first_name, last_name, password) VALUES (uid, first_name, last_name, pass);
END //

DELIMITER ;



DELIMITER //

CREATE PROCEDURE update_user_info(IN uid INT, IN field_name VARCHAR(64), IN new_value VARCHAR(256))
BEGIN
    SET @query = CONCAT('UPDATE User SET ', field_name, ' = "', new_value, '" WHERE user_id = ', uid);
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;




DELIMITER //

CREATE PROCEDURE add_favorite_dish(IN uid INT, IN dish_id INT)
BEGIN
    INSERT IGNORE INTO Eat_Favorites(user_id, dish_id) VALUES (uid, dish_id);
END //

DELIMITER ;



DELIMITER //

CREATE PROCEDURE remove_favorite_dish(IN uid INT, IN dish_id INT)
BEGIN
    DELETE FROM Eat_Favorites WHERE user_id = uid AND dish_id = dish_id;
END //

DELIMITER ;




DELIMITER //

CREATE PROCEDURE add_favorite_ride(IN uid INT, IN ride_id INT)
BEGIN
    INSERT IGNORE INTO Ride_Favorites(user_id, ride_id) VALUES (uid, ride_id);
END //

DELIMITER ;




DELIMITER //

CREATE PROCEDURE remove_favorite_ride(IN uid INT, IN ride_id INT)
BEGIN
    DELETE FROM Ride_Favorites WHERE user_id = uid AND ride_id = ride_id;
END //

DELIMITER ;