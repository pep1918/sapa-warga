const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
    res.json({ status: 'Sistem Sapa Warga Online' });
});


// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/surat', require('./routes/suratRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});