const express = require('express');
const cors = require('cors');
const parkingRoute = require('./ParkingRoutes/parkingRouter');
const spaceRoute = require('./ParkingRoutes/spaceRouter');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: "*"
}))

app.use(express.json());

app.use('/parking-space', spaceRoute);
app.use('/parking', parkingRoute);


app.listen(PORT, async() => {
    try {
        console.log(`server started on ${PORT} successfully`);
    } catch (error) {
        console.log(error)
    }
})