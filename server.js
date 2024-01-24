const express = require('express');
const mysql = require('mysql2');



const app = express();
const cors = require('cors')

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

// const BASE_URL = "http://localhost:8983/solr/database";

// let brands;
// let productnames;
// let notFetched = true;

// if (notFetched) {
//     // Fetch brands
//     const queryBrands = 'SELECT DISTINCT BRAND FROM PRODUCT_LIST';
//     connection.query(queryBrands, (error, results, fields) => {
//         if (error) {
//             console.error('Error fetching brands:', error);
//         } else {
//             brands = results;
//             notFetched = false;
//         }
//     });

//     // Fetch product names
//     const queryProductNames = 'SELECT DISTINCT PD_NAME FROM PRODUCT_LIST';
//     connection.query(queryProductNames, (error, results, fields) => {
//         if (error) {
//             console.error('Error fetching product names:', error);
//         } else {
//             productnames = results;
//             notFetched = false;
//         }
//     });
// }

// let pricelessThanKeywords = ["below", "less", "under"];
// let priceGreaterThanKeywords = ["above", "greater"];

// app.get('/search', async (req, res) => {
//     let query = req.query.q;

//     // Handle spaces in brand names
//     let brandValues = brands
//         .filter(brand => query.toLowerCase().includes(brand.BRAND.toLowerCase()))
//         .map(brand => brand.BRAND);

//     // Handle spaces in product names
//     let productValues = productnames
//         .filter(product => query.toLowerCase().includes(product.PD_NAME.toLowerCase()))
//         .map(product => product.PD_NAME);

//     // Handle spaces in price query
//     let priceQuery = query.split(" ");
//     let numbersOnly = priceQuery
//         .filter(value => !isNaN(value))
//         .map(value => {
//             const parsedValue = parseFloat(value);
//             return isNaN(parsedValue) ? null : parsedValue;
//         })
//         .filter(value => value !== null);

//     let isBelow = pricelessThanKeywords.some(keyword => query.toLowerCase().includes(keyword));
//     let isAbove = priceGreaterThanKeywords.some(keyword => query.toLowerCase().includes(keyword));

//     try {
//         let solrUrl = `${BASE_URL}/select?`;

//         // Brand query
//         // Brand query
//         if (brandValues.length > 0) {
//             const brandQuery = brandValues.map(brandValue => `BRAND:"${encodeURIComponent(brandValue)}"`).join(' OR ');
//             solrUrl += `fq=${brandQuery}`;
//         }



//         if (brandValues.length > 0 && productValues.length > 0) {
//             solrUrl += `&`;
//         }

//         // Product query
//         if (productValues.length > 0) {
//             solrUrl += `fq=${productValues.map(productValue => `PD_NAME:${encodeURIComponent(productValue)}`).join('%20OR%20')}`;
//         }

//         // Price query
//         if (isBelow) {
//             solrUrl += `&fq=MRP:[* TO ${numbersOnly[0]}]`;
//         }
//         if (isAbove) {
//             solrUrl += `&fq=MRP:[${numbersOnly[0]} TO *]`;
//         }

//         // Default query
//         if (productValues.length > 0 || brandValues.length > 0) {
//             solrUrl += `q=*:*`;
//         }

//         solrUrl += `&indent=true&wt=json`;

//         // Data fetching
//         const response = await fetch(solrUrl);
//         if (response.ok) {
//             let jsonResponse = await response.json();
//             jsonResponse = jsonResponse.response.docs;
//             res.json(jsonResponse);
//         } else {
//             console.error(`Error: ${response.status} - ${response.statusText}`);
//             res.status(response.status).send('Error fetching data from Solr');
//         }
//     } catch (err) {
//         console.log(err);
//     }
// });

const BASE_URL = "http://localhost:8983/solr/database"



let brands;
let productnames;
let notFetched = true;

if (notFetched) {
    const query = 'SELECT DISTINCT BRAND FROM PRODUCT_LIST';
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            brands = results;
            // console.log("the brands is",brands)
            notFetched = false;
        }

    });
    const query1 = 'SELECT DISTINCT PD_NAME FROM PRODUCT_LIST';
    connection.query(query1, (error, results, fields) => {
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            productnames = results;
            notFetched = false;
        }
    });
}

let pricelessThanKeywords = ["below", "less", "under"]
let priceGreaterThanKeywords = ["above", "greater",]

app.get('/search', async (req, res) => {
    let query = req.query.q;

    let isBelow = pricelessThanKeywords.some(keyword => {
        console.log(query.toLowerCase().includes(keyword))
        return query.toLowerCase().includes(keyword)
    });
    let isAbove = priceGreaterThanKeywords.some(keyword => query.toLowerCase().includes(keyword));

    console.log("isBelow:", isBelow);
    console.log("isAbove:", isAbove);

    let brandsQuery = query.split("under");
    let productsQuery = query.split(" ");
    let priceQuery = query.split(" ");

    let numbersOnly = priceQuery
        .filter(value => !isNaN(value))
        .map(value => parseFloat(value));

    console.log("numbers")
    console.log(numbersOnly);

    //   let brandValues = brandsQuery.filter(query => brands.some(brandObj => 
    //     brandObj && brandObj.brand && brandObj.brand.toLowerCase().includes((query && query.toLowerCase()))
    // ));
    // let brandValues = brands.toLowerCase().includes(query.toLocaleLowerCase())
    let brandValues = []
    console.log("the brand values array is", brandValues);
    console.log(brandsQuery);
    brandsQuery.map((word) => {
        brands.map((brand) => {
            let b = brand.BRAND;
            let tempword = word.toLowerCase();
            let tempbrand = b.toLowerCase();
            if (tempword === tempbrand) {
                brandValues.push(b)

            }
        })
    })
    console.log("the brand value  ----- ", brandValues)


    let productValues;

    productValues = productsQuery.filter(queryItem =>
        queryItem !== 'under' &&
        productnames.some(prdObj =>
            prdObj.PD_NAME.toLowerCase().includes(queryItem.toLowerCase())
        )
    );


    console.log("brands")
    console.log(brandValues);
    console.log("products")
    console.log(productValues);

    try {
        let solrUrl = `${BASE_URL}/select?`;
        //brand query
        if (brandValues.length > 0) {
            console.log("the brand value  ----- ", brandValues)

            brandValues.forEach((brandValue, i) => {
                if (i > 0) {
                    solrUrl += `%20OR%20`;
                    solrUrl += `BRAND:*${encodeURIComponent(brandValue.slice(1))}*`;

                }
                else {
                    if (brandValue.length > 1)
                        solrUrl += `fq=BRAND:*${encodeURIComponent(brandValue.slice(1))}*`;
                    else
                        solrUrl += `fq=BRAND:${encodeURIComponent(brandValue)}`;
                }
                console.log("the url is ", solrUrl)
            }
            )



        }
        if (brandValues.length > 0) {
            solrUrl += `&`
        }
        //products query
        if (productValues.length > 0) {
            productValues.forEach((productValue, i) => {
                if (i > 0) {
                    solrUrl += `%20OR%20`;
                    solrUrl += `PD_NAME:*${encodeURIComponent(productValue.slice(1))}*`;
                } else {
                    if (productValue.length > 1)
                        solrUrl += `fq=PD_NAME:*${encodeURIComponent(productValue.slice(1))}*`;
                    else
                        solrUrl += `fq=PD_NAME:${encodeURIComponent(productValue)}`
                }
            })
        }
        //Price query
        if (isBelow) {
            solrUrl += `&fq=`;
            let Qstr = `MRP:[* TO ${numbersOnly[0]}]`
            Qstr = (encodeURIComponent(Qstr))
            solrUrl += Qstr;
        }
        if (isAbove) {
            solrUrl += `&fq=`;
            let Qstr = `MRP:[${numbersOnly[0]} TO *]`
            Qstr = (encodeURIComponent(Qstr))
            solrUrl += Qstr;
        }
        //Default query
        if (productValues.length > 0 || brandValues.length > 0) {
            solrUrl += `&q=*%3A*`;
        }
        solrUrl += `&indent=true&wt=json`
        console.log(solrUrl)

        //Data fetching
        const response = await fetch(solrUrl);
        if (response.ok) {
            let jsonResponse = await response.json();
            jsonResponse = jsonResponse.response.docs;
            console.log(jsonResponse);
            res.json(jsonResponse);
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            res.status(response.status).send('Error fetching data from Solr');
        }
    } catch (err) {
        console.log(err);
    }

});

// app.get('/search/:searchTerm', async (req, res) => {
//     let searchTerm = req.params.searchTerm;

//     // Split the search term at the first space
//     const spaceIndex = searchTerm.indexOf(' ');
//     let firstHalf = searchTerm;

//     if (spaceIndex !== -1) {
//         firstHalf = searchTerm.substring(0, spaceIndex);
//     }

//     const ur = `http://localhost:8983/solr/database/select?q=PD_NAME:${firstHalf}* OR BRAND:${firstHalf}*`;


//     try {
//         let response = await fetch(ur);

//         if (response.ok) {
//             let jsonResponse = await response.json();
//             jsonResponse = jsonResponse.response.docs;
//             console.log(jsonResponse);
//             res.json(jsonResponse);
//         } else {
//             console.error(`Error: ${response.status} - ${response.statusText}`);
//             res.status(response.status).send('Error fetching data from Solr');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });



const PORT = process.env.PORT || 2000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});