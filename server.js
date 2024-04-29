const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');

const app = express();

// Enable CORS for all origins (or specify allowed origins)
app.use(cors()); // This allows requests from any origin

app.use(express.json()); // Parse JSON request bodies

// Apply routes
app.use('/api', routes);

const PORT = 3000; // Ensure this matches your backend port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});