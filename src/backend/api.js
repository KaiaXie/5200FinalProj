const express = require('express');
const db = require('./database');
const router = express.Router();

// Login API
router.post('/login', (req, res) => {
    const { first_name, last_name, password } = req.body;

    // Call the procedure
    db.query('CALL user_login(?, ?, ?, @uid)', [first_name, last_name, password], (error) => {
        if (error) {
            console.error("Error executing query:", error);
            return res.status(500).send(error);
        }

        // get the output variable @uid
        db.query('SELECT @uid AS user_id', (error, results) => {
            if (error) {
                console.error("Error selecting @uid:", error);
                return res.status(500).send(error);
            }

            const userId = results[0].user_id;
            if (userId) {
                res.json({ success: true, userId });
            } else {
                res.json({ success: false, message: 'Invalid credentials' });
            }
        });
    });
});

// Signup API
router.post('/signup', (req, res) => {
    const { first_name, last_name, password } = req.body;

    if (!first_name || !last_name || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Call the procedure for signing up new users
    db.query('CALL user_signup(?, ?, ?, @uid)', [first_name, last_name, password], (error) => {
        if (error) {
            console.error("Error executing signup query:", error);
            return res.status(500).json({ message: "Internal server error" });
        }

        db.query('SELECT @uid AS user_id', (error, results) => {
            if (error) {
                console.error("Error retrieving user ID:", error);
                return res.status(500).json({ message: "Internal server error" });
            }

            const userId = results[0].user_id;
            res.json({ success: true, userId });
        });
    });
});

// Get all parks
router.get('/getParks', (req, res) => {
    const query = 'SELECT park_id, name FROM Park';
    db.query(query, (error, results) => {
        if (error) return res.status(500).send(error);
        res.json(results);
    });
});


// Get park details
router.get('/getParkDetails', (req, res) => {
    const parkId = req.query.park_id;

    const parkQuery = `
        SELECT p.name AS park_name, c.name AS city_name, co.name AS company_name
        FROM Park p
        JOIN City c ON p.city_id = c.city_id
        JOIN Company co ON p.company_id = co.company_id
        WHERE p.park_id = ?;
    `;

    db.query(parkQuery, [parkId], (error, parkResults) => {
        if (error) return res.status(500).send(error);
        if (parkResults.length === 0) {
            return res.status(404).json({ message: "Park not found" });
        }

        const park = {
            name: parkResults[0].park_name,
            city: parkResults[0].city_name,
            company: parkResults[0].company_name
        };

        // Query restaurants
        const restaurantQuery = `SELECT restaurant_id AS id, name FROM Restaurant WHERE park_id = ?`;
        db.query(restaurantQuery, [parkId], (error, restaurantResults) => {
            if (error) return res.status(500).send(error);

            // Query rides
            const rideQuery = `SELECT ride_id AS id, name FROM Ride WHERE park_id = ?`;
            db.query(rideQuery, [parkId], (error, rideResults) => {
                if (error) return res.status(500).send(error);

                // Query stores
                const storeQuery = `SELECT store_id AS id, name FROM Store WHERE park_id = ?`;
                db.query(storeQuery, [parkId], (error, storeResults) => {
                    if (error) return res.status(500).send(error);

                    // Query events
                    const eventQuery = `SELECT event_id AS id, name FROM Event WHERE park_id = ?`;
                    db.query(eventQuery, [parkId], (error, eventResults) => {
                        if (error) return res.status(500).send(error);

                        res.json({
                            park,
                            restaurants: restaurantResults,
                            rides: rideResults,
                            stores: storeResults,
                            events: eventResults
                        });
                    });
                });
            });
        });
    });
});

// Get restaurant details and dish information
router.get('/getRestaurantDetails', (req, res) => {
    const restaurantId = req.query.id;
    const userId = req.query.userId;
    const query = `
        SELECT r.name AS restaurant_name, d.dish_id, d.name AS dish_name, d.price, d.description,
        EXISTS (SELECT * FROM Eat_Favorites WHERE user_id = ? AND dish_id = d.dish_id) AS isFavorite
        FROM Restaurant r
        JOIN Dish d ON r.restaurant_id = d.restaurant_id
        WHERE r.restaurant_id = ?;
    `;
    db.query(query, [userId, restaurantId], (error, results) => {
        if (error) return res.status(500).send(error);
        const restaurantName = results[0].restaurant_name;
        const dishes = results.map(dish => ({
            id: dish.dish_id,
            name: dish.dish_name,
            price: dish.price,
            description: dish.description,
            isFavorite: dish.isFavorite
        }));
        res.json({ name: restaurantName, dishes });
    });
});

// Add or remove favorite dishes
router.post('/toggleFavoriteDish', (req, res) => {
    const { userId, dishId, action } = req.body;
    const query = action === 'add' 
        ? 'INSERT INTO Eat_Favorites (user_id, dish_id) VALUES (?, ?)' 
        : 'DELETE FROM Eat_Favorites WHERE user_id = ? AND dish_id = ?';
    
    db.query(query, [userId, dishId], (error) => {
        if (error) {
            // Avoid duplicate insertion of already existing favorites
            if (error.code === 'ER_DUP_ENTRY' && action === 'add') {
                return res.json({ success: true });
            }
            return res.status(500).send(error);
        }
        res.json({ success: true });
    });
});

// Get ride details
router.get('/getRideDetails', (req, res) => {
    const rideId = req.query.id;
    const userId = req.query.userId;
    const query = `
        SELECT r.name, r.type, r.description,
        EXISTS (SELECT * FROM Ride_Favorites WHERE user_id = ? AND ride_id = ?) AS isFavorite
        FROM Ride r
        WHERE r.ride_id = ?;
    `;
    db.query(query, [userId, rideId, rideId], (error, results) => {
        if (error) return res.status(500).send(error);
        const { name, type, description, isFavorite } = results[0];
        res.json({ name, type, description, isFavorite });
    });
});

// Add or remove favorite rides
router.post('/toggleFavoriteRide', (req, res) => {
    const { userId, rideId, action } = req.body;
    const query = action === 'add' 
        ? 'INSERT INTO Ride_Favorites (user_id, ride_id) VALUES (?, ?)' 
        : 'DELETE FROM Ride_Favorites WHERE user_id = ? AND ride_id = ?';
    
    db.query(query, [userId, rideId], (error) => {
        if (error) {
            // Avoid duplicate insertion of already existing favorites
            if (error.code === 'ER_DUP_ENTRY' && action === 'add') {
                return res.json({ success: true });
            }
            return res.status(500).send(error);
        }
        res.json({ success: true });
    });
});

// Get store details
router.get('/getStoreDetails', (req, res) => {
    const storeId = req.query.id;
    const query = `
        SELECT s.name AS store_name, s.theme, so.souvenir_id, so.name AS souvenir_name, so.price
        FROM Store s
        JOIN store_sells_souvenir ss ON s.store_id = ss.store_id
        JOIN Souvenir so ON ss.souvenir_id = so.souvenir_id
        WHERE s.store_id = ?;
    `;
    db.query(query, [storeId], (error, results) => {
        if (error) return res.status(500).send(error);
        const storeName = results[0].store_name;
        const theme = results[0].theme;
        const souvenirs = results.map(item => ({
            id: item.souvenir_id,
            name: item.souvenir_name,
            price: item.price
        }));
        res.json({ name: storeName, theme, souvenirs });
    });
});

// Get event details
router.get('/getEventDetails', (req, res) => {
    const eventId = req.query.id;
    const query = 'SELECT name, description, start_date, end_date FROM Event WHERE event_id = ?';
    
    db.query(query, [eventId], (error, results) => {
        if (error) return res.status(500).send(error);
        const { name, description, start_date, end_date } = results[0];
        res.json({
            name,
            description,
            startDate: start_date,
            endDate: end_date
        });
    });
});

// Get user profile and favorites
router.get('/getUserProfile', (req, res) => {
    const userId = req.query.id;
    
    const profileQuery = `
        SELECT first_name, last_name, password, age, phone 
        FROM User 
        WHERE user_id = ?;
    `;
    
    const favoriteDishesQuery = `
        SELECT d.dish_id AS id, d.name 
        FROM Eat_Favorites ef 
        JOIN Dish d ON ef.dish_id = d.dish_id 
        WHERE ef.user_id = ?;
    `;
    
    const favoriteRidesQuery = `
        SELECT r.ride_id AS id, r.name 
        FROM Ride_Favorites rf 
        JOIN Ride r ON rf.ride_id = r.ride_id 
        WHERE rf.user_id = ?;
    `;
    
    db.query(profileQuery, [userId], (error, profileResults) => {
        if (error) return res.status(500).send(error);

        // Check if the user exists
        if (profileResults.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile = profileResults[0];
        
        // Query favorite dishes
        db.query(favoriteDishesQuery, [userId], (error, favoriteDishes) => {
            if (error) return res.status(500).send(error);

            // Query favorite rides
            db.query(favoriteRidesQuery, [userId], (error, favoriteRides) => {
                if (error) return res.status(500).send(error);

                res.json({
                    firstName: profile.first_name,
                    lastName: profile.last_name,
                    password: profile.password,
                    age: profile.age,
                    phone: profile.phone,
                    favoriteDishes,
                    favoriteRides
                });
            });
        });
    });
});

// Update user profile information
router.post('/updateProfile', (req, res) => {
    const { userId, fieldName, newValue } = req.body;
    const query = `CALL update_user_info(?, ?, ?)`;
    
    db.query(query, [userId, fieldName, newValue], (error) => {
        if (error) return res.status(500).send(error);
        res.json({ success: true });
    });
});

router.get('/getRestaurantByDish', (req, res) => {
    const dishId = req.query.dish_id;

    const query = `
        SELECT restaurant_id 
        FROM Dish 
        WHERE dish_id = ?;
    `;

    db.query(query, [dishId], (err, results) => {
        if (err) {
            console.error('Error fetching restaurant ID:', err);
            res.status(500).send('Internal server error');
        } else if (results.length === 0) {
            res.status(404).send('Dish not found');
        } else {
            res.json({ restaurantId: results[0].restaurant_id });
        }
    });
});

module.exports = router;