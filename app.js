const express = require('express');
const app = express();
const port = 3000;

const { Pool } = require('pg');
const pool = new Pool({
    host: 'localhost',
    database: 'houses',
    user: 'postgres',
    password: 'pinter12',
    port: 5432
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/houses', async(req, res) => {
    try {
        let houses = await pool.query('SELECT * FROM houses');
        res.json(houses.rows);
    } catch (error) {
        console.error('Error mengambil data :', error);
        res.status(500).json({ error: 'server error' });
    }
});

app.get('/houses/:id', async(req, res) => {
    let id = req.params.id;
    try {
        let house = await pool.query('SELECT * FROM houses WHERE id = $1', [id]);
        if (house.rows.length === 0) {
            res.status(404).json({ error: 'not found' });
        } else {
            res.json(house.rows[0]);
        }
    } catch (error) {
        console.error('Error mengambil data :', error);
        res.status(500).json({ error: 'server error' });
    }
});

app.post('/houses', async(req, res) => {
    let address = req.body.address;
    let owner_name = req.body.owner_name;
    let num_rooms = req.body.num_rooms;
    let has_garden = req.body.has_garden;
    try {
        let addHouse = await pool.query('INSERT INTO houses (address, owner_name, num_rooms, has_garden) VALUES ($1, $2, $3, $4) RETURNING *', [address, owner_name, num_rooms, has_garden]);
        res.json({ data: addHouse.rows[0] });
    } catch (error) {
        console.error('Error menambahkan house:', error);
        res.status(500).json({ error: 'server error' });
    }
});

app.listen(port, () => {
    console.log('app listening on port', port);
});