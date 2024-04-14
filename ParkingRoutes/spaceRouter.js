const { Router } = require('express');
const spaceRoute = Router();
const conn = require('../conn');

// Create the 'parking_space' table if not exists
// conn.query(`
//   CREATE TABLE IF NOT EXISTS parking_space (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     space_number INT NOT NULL,
//     is_occupied BOOLEAN NOT NULL DEFAULT FALSE
//   )
// `, (error, results) => {
//     if (error) {
//         console.error('Error creating parking_space table:', error);
//     } else {
//         // Array to hold the data for insertion
//         const parkingSpacesData = [
//             [1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12]
//         ];

        
//         // Insert data into the 'parking_space' table
//         conn.query(`
//             INSERT INTO parking_space (space_number) VALUES ?
//         `, [parkingSpacesData], (insertError, insertResults) => {
//             if (insertError) {
//                 console.error('Error inserting parking space data:', insertError);
//             } else {
//                 console.log('Parking space data inserted successfully');
//             }
//         });
//     }
// });

spaceRoute.get('/availability', async (req, res) => {
    conn.query('SELECT * FROM parking_space WHERE is_occupied = FALSE', (err, result) => {
        if (err) {
            console.error('Error in getting availability:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Send response with occupied and vacant spaces counts
        res.status(200).json(result);
    });
});



// Route to handle parking entry and mark parking space as occupied
spaceRoute.post('/occupy', async (req, res) => {
    const { space_id } = req.body;

    try {
        // Update the parking_space table to mark the space as occupied
        conn.query('UPDATE parking_space SET is_occupied = TRUE WHERE id = ?', [space_id], (err, result) => {
            if (err) {
                console.error('Error marking space as occupied:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Check if any rows were affected by the update
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Parking space not found' });
            }

            console.log('Parking space marked as occupied successfully');
            res.status(200).json({ message: 'Parking space marked as occupied successfully' });
        });
    } catch (err) {
        console.error('Error marking space as occupied:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


spaceRoute.post('/vacate', async (req, res) => {
    const { space_id } = req.body;

    try {
        // Update the parking_space table to mark the space as vacant
        conn.query('UPDATE parking_space SET is_occupied = FALSE WHERE id = ?', [space_id], (err, result) => {
            if (err) {
                console.error('Error marking space as vacant:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Check if any rows were affected by the update
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Parking space not found' });
            }

            console.log('Parking space marked as vacant successfully');
            res.status(200).json({ message: 'Parking space marked as vacant successfully' });
        });
    } catch (err) {
        console.error('Error marking space as vacant:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = spaceRoute;



