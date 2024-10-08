const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const clothingItems=require('./Store/clothingItems.js')
const ejsLayouts=require('ejs-locals');
const Fuse=require('fuse.js');



const options={
    includeScore: true,
    threshold: 0.3,
    caseSensitive: false,
    keys:['name','brand']
}
const fuse =new  Fuse(clothingItems,options);

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Set EJS as the template engine
app.engine('ejs', ejsLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Render the main page
app.get('/', (req, res) => {
    res.render('index',{clothingItems});
});

// Render the product details page
app.get('/product/:name', (req, res) => {
    const product = clothingItems.find(item => item.name.toLowerCase() === req.params.name.toLowerCase());
    if (product) {
        res.render('product', { product });
    } else {
        res.status(404).send('Product not found');
    }
});

// Render the about page
app.get('/about', (req, res) => {
    res.render('about');
});

// Render the contact page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Handle search requests
app.get('/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;

  
   
    let filteredItems = fuse.search(query);
    let totalPages = Math.ceil(filteredItems.length / pageSize);
    
    filteredItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);
    

    res.json({
        items: filteredItems,
        totalPages: totalPages
    });
});

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    // In a real application, you would send this data to an email or database
    console.log(`Contact form submission:
      Name: ${name}
      Email: ${email}
      Message: ${message}`);
    res.send('Thank you for contacting us!');
});
app.get('/cart', (req, res) => {
    res.render('carts');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
