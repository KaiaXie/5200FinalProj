CREATE DATABASE FinalProj;

USE FinalProj;

CREATE TABLE City (
	city_id INT PRIMARY KEY,
    name VARCHAR(32)
);

CREATE TABLE Company (
	company_id INT PRIMARY KEY,
    name VARCHAR(32)
);

CREATE TABLE Park (
	park_id INT PRIMARY KEY,
    name VARCHAR(32),
    company_id int,
    city_id INT,
    FOREIGN KEY (company_id) REFERENCES Company(company_id),
    FOREIGN KEY (city_id) REFERENCES City(city_id)
);

CREATE TABLE Event (
    event_id INT PRIMARY KEY,
    name VARCHAR(64),
    description VARCHAR(256),
    start_date DATE,
    end_date DATE,
    park_id INT,
    FOREIGN KEY (park_id) REFERENCES Park(park_id)
);

CREATE TABLE Restaurant (
	restaurant_id INT PRIMARY KEY,
    name VARCHAR(64),
    type VARCHAR(64),
    park_id INT,
    FOREIGN KEY (park_id) REFERENCES Park(park_id)
);

CREATE TABLE Dish (
	dish_id INT PRIMARY KEY,
    name VARCHAR(64),
    price INT,
    description VARCHAR(256),
    restaurant_id INT,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id)
);

CREATE TABLE Store (
	store_id INT PRIMARY KEY,
    name VARCHAR(64),
    theme VARCHAR(64),
    park_id INT,
    FOREIGN KEY (park_id) REFERENCES Park(park_id)
);

CREATE TABLE Souvenir (
	souvenir_id INT PRIMARY KEY,
    name VARCHAR(32),
    price INT
);

CREATE TABLE store_sells_souvenir (
	souvenir_id INT,
    store_id INT,
    PRIMARY KEY (souvenir_id, store_id),
	FOREIGN KEY (souvenir_id) REFERENCES Souvenir(souvenir_id),
    FOREIGN KEY (store_id) REFERENCES Store(store_id)
);

CREATE TABLE Ride (
	ride_id INT PRIMARY KEY,
    name VARCHAR(128),
    type VARCHAR(128),
    description VARCHAR(256),
    park_id INT,
    FOREIGN KEY (park_id) REFERENCES Park(park_id)
);

CREATE TABLE User (
	user_id INT PRIMARY KEY,
    password VARCHAR(256),
    first_name VARCHAR(64),
    last_name VARCHAR(64),
    age INT,
    phone CHAR(10)
);

CREATE TABLE Ride_Favorites (
	user_id INT,
    ride_id INT,
    PRIMARY KEY (user_id, ride_id),
	FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (ride_id) REFERENCES Ride(ride_id)
);

CREATE TABLE Eat_Favorites (
	user_id INT,
    dish_id INT,
    PRIMARY KEY (user_id, dish_id),
	FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (dish_id) REFERENCES Dish(dish_id)
);


INSERT INTO City VALUES (1, 'Orlando'),
						(2, 'Los Angeles'),
                        (3, 'New England');
INSERT INTO Company VALUES (1, 'Disney'),
						   (2, 'Universal'),
						   (3, 'Six Flags');

INSERT INTO Park VALUES (1, 'Magic Kingdom', 1, 1),
						(2, 'California Adventure', 1, 2),
                        (3, 'Islands of Adventure', 2, 1),
                        (4, 'Universal Studios', 2, 2),
                        (5, 'Hurricane Harbor', 3, 3);

INSERT INTO Restaurant VALUES (1, 'Be Our Guest', 'French', 1),
							  (2, 'Cinderella\'s Royal Table', 'American', 1),
                              (3, 'Carthay Circle', 'Southern California', 2),
                              (4, 'Lamplight Lounge', 'California', 2),
                              (5, 'Mythos Restaurant', 'Mediterranean and contemporary American', 3),
                              (6, 'Three Broomsticks', 'British', 3),
                              (7, 'Lombard\'s Seafood Grille', 'Seafood', 4),
                              (8, 'JB`s Smokehouse Barbeque', 'BBQ', 5);

INSERT INTO Dish VALUES (1, 'French Onion Soup', 20, 'Caramelized onions in a rich beef broth, topped with a toasted crouton and melted Gruyère cheese.', 1),
						(2, 'Center-Cut Filet Mignon', 50, 'Tender filet mignon served with Robuchon Yukon potatoes, seasonal vegetables, and a red wine glaze.', 1),
                        (3, 'Dessert Trio', 25, 'A selection of three mini desserts, including a white chocolate "Chip" cup filled with grey stuff, a dark chocolate truffle, and a raspberry macaron.', 1),
                        (4, 'Charcuterie Plate', 30, 'An assortment of cured meats, artisanal cheeses, and accompaniments.', 2),
						(5, 'Roasted All-Natural Chicken Breast', 35, 'Served with farro risotto, seasonal vegetables, and a chicken jus.', 2),
						(6, 'The Clock Strikes Twelve', 20, 'A dark chocolate mousse with a dark chocolate ganache and a raspberry coulis.', 2),
						(7, 'Fried Biscuits', 12, 'Light and fluffy biscuits served with apricot butter.', 3),
						(8, 'Fire-Grilled Angus Burger', 18, 'A juicy Angus beef patty topped with cheddar cheese and served on a brioche bun.', 3),
						(9, 'Chocolate Lava Cake', 15, 'Warm molten chocolate cake served with vanilla bean ice cream.', 3),
						(10, 'Lobster Nachos', 22, 'Tortilla chips topped with lobster, black beans, cheddar cheese sauce, and pico de gallo.', 4),
						(11, 'Crab & Potato Cake Benedict', 24, 'Crab and potato cakes topped with poached eggs and hollandaise sauce.', 4),
						(12, 'Crispy Piggy Wings', 18, 'Fried pork drumettes tossed in a chili-ginger glaze.', 4),
						(13, 'Roasted Red Pepper Hummus', 14, 'Hummus served with grilled pita bread.', 5),
						(14, 'Mediterranean Grilled Octopus', 28, 'Grilled octopus with olive oil and spices.', 5),
						(15, 'Scallop and Truffle Risotto', 32, 'Creamy risotto topped with seared scallops and summer truffle.', 5),
						(16, 'Fish and Chips', 18, 'Traditional British-style battered fish with fries.', 6),
						(17, 'Spareribs Platter', 22, 'Barbecued pork ribs served with corn and mashed potatoes.', 6),
						(18, 'Shepherd\'s Pie', 16, 'Ground beef and vegetables topped with mashed potatoes.', 6),
						(19, 'New England Clam Chowder', 15, 'A rich and creamy chowder with clams and potatoes.', 7),
						(20, 'Seafood Alfredo', 26, 'Pasta in a creamy Alfredo sauce with shrimp and scallops.', 7),
						(21, 'Crab Cakes', 24, 'Fresh crab cakes served with a tangy remoulade.', 7),
						(22, 'Pulled Pork Sandwich', 16, 'Slow-cooked pulled pork with tangy barbecue sauce.', 8),
						(23, 'Smoked Brisket Platter', 22, 'Tender brisket served with coleslaw and cornbread.', 8),
						(24, 'BBQ Chicken Wings', 14, 'Crispy wings tossed in barbecue sauce.', 8);

INSERT INTO Store VALUES (1, 'Emporium', 'Disney Memorabilia', 1),
						 (2, 'Big Top Souvenirs', 'Circus Theme', 1),
					 	 (3, 'Elias & Co.', 'Hollywood Glamour', 2),
					 	 (4, 'Bing Bong\'s Sweet Stuff', 'Candy and Pixar Memorabilia', 2),
						 (5, 'Treasures of Poseidon', 'Mythological Theme', 3),
						 (6, 'Filch\'s Emporium of Confiscated Goods', 'Wizarding World', 3),
						 (7, 'Universal Studios Store', 'Studio Theme', 4),
						 (8, 'Jurassic Outfitters', 'Dinosaur Theme', 4),
						 (9, 'Six Flags Emporium', 'Park Souvenirs', 5),
						 (10, 'Looney Tunes Superstore', 'Cartoon Theme', 5);

INSERT INTO Souvenir VALUES (1, 'Mickey Mouse Ears', 25),
							(2, 'Disney Castle Snow Globe', 40),
							(3, 'Pixar Ball', 15),
							(4, 'Buzz Lightyear Action Figure', 30),
							(5, 'Poseidon Trident Keychain', 8),
							(6, 'Wizard Wand', 40),
							(7, 'Universal Studios T-Shirt', 20),
							(8, 'Jurassic Park Mug', 15),
							(9, 'Six Flags Logo Hat', 18),
							(10, 'Looney Tunes Plush Toy', 25);

INSERT INTO store_sells_souvenir VALUES (1, 1), (2, 1), (3, 2), (4, 2), (5, 3), 
										(6, 3), (7, 4), (8, 4), (9, 5), (10, 5);

INSERT INTO Ride VALUES
(1, 'Space Mountain', 'Roller Coaster', 'A high-speed indoor roller coaster.', 1),
(2, 'Haunted Mansion', 'Dark Ride', 'A spooky journey through a haunted house.', 1),
(3, 'Splash Mountain', 'Water Ride', 'A thrilling log flume ride.', 1),

(4, 'Radiator Springs Racers', 'Dark Ride', 'A scenic ride through the world of Cars.', 2),
(5, 'Guardians of the Galaxy – Mission: BREAKOUT!', 'Thrill Ride', 'A thrilling drop tower ride.', 2),
(6, 'Incredicoaster', 'Roller Coaster', 'A high-speed coaster with Pixar theming.', 2),

(7, 'The Incredible Hulk Coaster', 'Roller Coaster', 'A high-speed, inversion-heavy coaster.', 3),
(8, 'Hagrid\'s Magical Creatures Motorbike Adventure', 'Dark Ride', 'A motorbike ride through the Forbidden Forest.', 3),
(9, 'Jurassic Park River Adventure', 'Water Ride', 'A thrilling boat ride with dinosaurs.', 3),

(10, 'Transformers: The Ride 3D', 'Dark Ride', 'A 3D battle with Transformers.', 4),
(11, 'The Mummy Returns', 'Dark Ride', 'A spooky coaster through an Egyptian tomb.', 4),
(12, 'Despicable Me Minion Mayhem', 'Simulator', 'A fun 3D simulator ride with Minions.', 4),

(13, 'Superman: Ride of Steel', 'Roller Coaster', 'A hyper coaster with thrilling drops.', 5),
(14, 'Batman: The Dark Knight', 'Dark Ride', 'A high-speed coaster through Gotham City.', 5),
(15, 'Hurricane Bay', 'Water Ride', 'A family-friendly water attraction.', 5);

INSERT INTO User (user_id, password, first_name, last_name, age, phone) VALUES
(1, 'password123', 'Sue', 'Luo', 27, 5512560628),
(2, 'password456', 'Xinbo', 'Fan', 25, 2019939235),
(3, 'password789', 'Jean', 'Xie', 24, 7812889531);

INSERT INTO Ride_Favorites VALUES
(1, 1), -- User 1 plans to ride Space Mountain
(2, 7), -- User 2 plans to ride The Incredible Hulk Coaster
(3, 13); -- User 3 plans to ride Superman: Ride of Steel

INSERT INTO Eat_Favorites VALUES
(1, 1), -- User 1 plans to eat French Onion Soup at Be Our Guest
(2, 16), -- User 2 plans to eat Fish and Chips at Three Broomsticks
(3, 19); -- User 3 plans to eat New England Clam Chowder at Lombard's Seafood Grille

INSERT INTO Event VALUES
-- Magic Kingdom
(1, 'Mickey\'s Not-So-Scary Halloween Party', 'A fun-filled Halloween celebration for all ages.', '2024-10-01', '2024-10-31', 1),
(2, 'Disney Very Merriest After Hours', 'Celebrate the holiday season with magical lights and entertainment.', '2024-12-01', '2024-12-25', 1),
-- California Adventure
(3, 'Food and Wine Festival', 'Explore culinary creations and wine from California and beyond.', '2024-03-01', '2024-04-30', 2),
-- Universal Studios
(4, 'Mardi Gras Parade', 'Celebrate Mardi Gras with live music, food, and parades.', '2024-02-01', '2024-03-15', 4),
(5, 'Summer Concert Series', 'Enjoy live music performances from top artists.', '2024-06-01', '2024-08-31', 4),
-- Hurricane Harbor
(6, 'Family Water Olympics', 'A fun-filled day with team water challenges and prizes.', '2024-08-20', '2024-09-10', 5);

