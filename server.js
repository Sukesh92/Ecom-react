const express = require('express');
const mysql = require('mysql2');
const cors = require('cors')



const app = express();
app.use(cors());
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sukesh01@chinu',
    database: 'newproject',
});


// Connect to the MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get('/category', (req, res) => {
    // Perform a SELECT query on the 'category_list' table
    console.log('Received request for /category');

    connection.query('SELECT * FROM CATEGORY_LIST', (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(results);
    });
});


app.get('/products', (req, res) => {


    connection.query('SELECT * FROM PRODUCT_LIST', (err, results) => {

        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: `Internal Server Error: ${err.message}` });

            return;
        }
        console.log(results);
        res.send({ results: results });
    });
});
app.get('/products/category/:name', (req, res) => {
    const categoryId = req.params.name;
    console.log(categoryId);

    // SQL query for products without pagination
    const productSqlQuery = 'SELECT * FROM PRODUCT_LIST WHERE CD = ?';
    connection.query(productSqlQuery, [categoryId], (err, results) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.code);
            console.error(err.message);
            return;
        }


        if (results.length === 0) {
            // No products found for the category
            res.status(404).json({ error: 'No products found for the category' });
            return;
        }

        console.log(results);
        res.send({ results: results });
    });
});



app.get('/search/:searchTerm', async (req, res) => {
    let searchTerm = req.params.searchTerm;

    // Split the search term at the first space
    const spaceIndex = searchTerm.indexOf(' ');
    let firstHalf = searchTerm;

    if (spaceIndex !== -1) {
        firstHalf = searchTerm.substring(0, spaceIndex);
    }

    const ur = `http://localhost:8983/solr/database/select?q=PD_NAME:${firstHalf}* OR BRAND:${firstHalf}*`;
    

    try {
        let response = await fetch(ur);

        if (response.ok) {
            let jsonResponse = await response.json();
            jsonResponse = jsonResponse.response.docs;
            console.log(jsonResponse);
            res.json(jsonResponse);
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            res.status(response.status).send('Error fetching data from Solr');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});



const PORT = process.env.PORT || 2000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});