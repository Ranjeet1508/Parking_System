const { Router } = require('express');
const parkingRoute = Router();
const conn = require('../conn');

// conn.query(`
//   CREATE TABLE IF NOT EXISTS parkings (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     vehicle_number VARCHAR(255) NOT NULL,
//     arrive_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     departed_at TIMESTAMP NULL DEFAULT NULL,
//     parking_space_id INT,
//     FOREIGN KEY (parking_space_id) REFERENCES parking_space(id)
//   )
// `, (error, results) => {
//     if (error) {
//         console.error('Error creating parking table:', error);
//     } else {
//         console.log('Parking table created successfully');
//     }
// });

  
// Route to search for a vehicle by its vehicle number and filter by date
parkingRoute.get('/', async (req, res) => {
    const { vehicle_number, date } = req.query;
    let query = 'SELECT * FROM parkings';
  
    // If a vehicle number is provided, add it to the query
    if (vehicle_number) {
      query += ` WHERE vehicle_number = '${vehicle_number}'`;
    }
  
    // If a date is provided, add the date filter to the query
    if (date) {
      // Assuming date format is YYYY-MM-DD
      query += ` WHERE DATE(arrive_at) = '${date}'`;
    }
  
    try {
      // Execute the constructed query to fetch parking records
      conn.query(query, (err, result) => {
        if (err) {
          console.error('Error getting info:', err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          console.log('Got vehicle data successfully');
          // Send the fetched data in the response
          res.status(200).json({ message: 'Got data successfully', result });
        }
      });
    } catch (err) {
      console.error('Error fetching parking vehicle info:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


// Route to handle when a vehicle enters the parking lot
parkingRoute.post('/entry', async (req, res) => {
    const { vehicle_number, parking_space_id } = req.body;
    try {
        // Insert a new parking record with the arrival time
        conn.query('INSERT INTO parkings (vehicle_number, parking_space_id) VALUES (?, ?)', [vehicle_number, parking_space_id], (err, result) => {
            if (err) {
                console.error('Error parking vehicle:', err);
                res.status(500).json({ error: 'internal server error' });
            } else {
                console.log('Vehicle parked successfully');
                res.status(200).json({ message: 'vehichle can go in parking' });
            }
        });
    } catch (err) {
        console.error('Error parking vehicle:', err);
        res.status(500).json({ error: 'internal server error' });
    }
});


// Route to handle when a vehicle exits the parking lot
parkingRoute.post('/exit', async (req, res) => {
    const { vehicle_number } = req.body;

    try {
        // Update the departure time for the corresponding vehicle
        conn.query('UPDATE parkings SET departed_at = CURRENT_TIMESTAMP WHERE vehicle_number = ? AND departed_at IS NULL', [vehicle_number], (err, result) => {
            if (err) {
                console.error('Error updating departure time:', err);
                res.status(500).json({ error: 'internal server error' });
            } else {
                if (result.affectedRows === 0) {
                    res.status(404).json({ error: 'Vehicle not found or already departed' });
                } else {
                    console.log('Vehicle departed successfully');
                    res.status(200).json({ message: 'Vehicle departed successfully' });
                }
            }
        });
    } catch (err) {
        console.error('internal server error:', err);
        res.status(500).json({ error: 'internal server error' });
    }
});


module.exports = parkingRoute;
