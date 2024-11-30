import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
import cors from 'cors';
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

const MONGO_URI = "mongodb+srv://sagarbawanthade2004:*30August2004*@grocerydb.2xuwp.mongodb.net/?retryWrites=true&w=majority"
// Connect to MongoDB
mongoose.connect(MONGO_URI, 
   ).then(() => console.log('Connected to MongoDB Successfully'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));


// Define the Product schema and model
const productSchema = new mongoose.Schema({
    name: String,
    barcode: String,
    barcodeImage: String,
    image: String,
    fats: String,
    carbohydrates: String,
    nutrients: Object,
    sugar: String,
    brandName: String,        // Name of the brand
    price: Number,            // Price of the product
    weight: String,           // Weight (e.g., "500g", "1kg")
    country: String,          // Country of origin
    rating: {                 // Rating (out of 5)
        type: Number,
        min: 0,
        max: 5
    }
});

const Product = mongoose.model('Product', productSchema);

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).send('Error retrieving products');
    }
});

// Get a product by barcode
app.get('/api/products/:barcode', async (req, res) => {
    try {
        const product = await Product.findOne({ barcode: req.params.barcode });
        if (product) res.json(product);
        else res.status(404).send('Product not found');
    } catch (error) {
        res.status(500).send('Error retrieving product');
    }
});

// Add a new product
app.post('/api/addproducts', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(400).json({ error: 'Error adding product', details: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
