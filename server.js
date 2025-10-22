const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const { DistrictData, sequelize } = require('./models/DistrictData');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;



// CSV file path
const CSV_FILE_PATH = './data.csv';

// Function to import CSV to DB
async function importCSV() {
    const results = [];
    fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (let row of results) {
                    // Adjust keys according to your CSV column names
                    await DistrictData.create({
                        district: row['District'] || row['district_name'],
                        month: row['Month'] || row['month'],
                        works_completed: parseInt(row['Works Completed'] || 0),
                        payments: parseFloat(row['Payments'] || 0)
                    });
                }
                console.log('CSV data imported successfully!');
            } catch (err) {
                console.error('Error importing CSV:', err);
            }
        });
}

// Sync DB and import CSV once at start
sequelize.sync().then(() => {
    console.log('Database synced.');
    importCSV();
});

// API to fetch district-wise data
app.get('/district/:name', async (req, res) => {
    const districtName = req.params.name;
    try {
        const data = await DistrictData.findAll({ where: { district: districtName } });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the District Data API');
});

app.listen(5000, () => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)));








// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const { DistrictData, sequelize } = require('./models/DistrictData');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const API_KEY = '579b464db66ec23bdd000001399d2a13cebf48ff5d6d83525b45ed88'; // Replace with your key
// const API_URL = 'https://api.data.gov.in/resource/YOUR_ENDPOINT?format=json&api-key=' + API_KEY;

// app.get('/district/:name', async (req, res) => {
//     const districtName = req.params.name;

//     try {
//         // Check DB first
//         const cachedData = await DistrictData.findAll({ where: { district: districtName } });
//         if (cachedData.length > 0) return res.json(cachedData);

//         // Fetch from API
//         const response = await axios.get(API_URL + `&filters[district_name]=${districtName}`);
//         const apiData = response.data.records;

//         // Save in DB
//         const savedData = [];
//         for (let record of apiData) {
//             const entry = await DistrictData.create({
//                 district: record.district_name,
//                 month: record.month,
//                 works_completed: record.works_completed || 0,
//                 payments: record.payments || 0
//             });
//             savedData.push(entry);
//         }

//         res.json(savedData);

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error or API unreachable' });
//     }
// });

// sequelize.sync().then(() => {
//     app.listen(5000, () => console.log('Server running on port 5000'));
// });
