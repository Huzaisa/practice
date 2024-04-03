const express = require('express');
const app = express();
const cors = require('cors');
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
app.use(cors());


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

//penggunaan let/const nya sama aja kea yang post, hanya saja dibuat dalam satu line
app.put('/houses/:id', async(req, res) => {
    const id = req.params.id;
    const { address, owner_name, num_rooms, has_garden } = req.body;
    try {
        const updatedHouse = await pool.query(
            'UPDATE houses SET address = $1, owner_name = $2, num_rooms = $3, has_garden = $4 WHERE id = $5 RETURNING *', [address, owner_name, num_rooms, has_garden, id]
        );
        if (updatedHouse.rows.length === 0) {
            res.status(404).json({ error: 'not found' });
        } else {
            res.json({ data: updatedHouse.rows[0] });
        }
    } catch (error) {
        console.error('Error updating :', error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.delete('/houses/:id', async(req, res) => {
    const id = req.params.id;
    try {
        const deletedHouse = await pool.query('DELETE FROM houses WHERE id = $1 RETURNING *', [id]);
        if (deletedHouse.rows.length === 0) {
            res.status(404).json({ error: 'not found' });
        } else {
            res.json({ message: 'deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting house:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.listen(port, () => {
    console.log('app listening on port', port);
});