const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 3001;
require('dotenv').config({ path: '.env.local' });

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas (cupstory database)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// User schema and model (users collection)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'users' });
const User = mongoose.model('User', userSchema);

// Cart schema and model (cart collection)
const cartSchema = new mongoose.Schema({
    email: { type: String, required: true },
    items: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ]
}, { collection: 'cart' });
const Cart = mongoose.model('Cart', cartSchema);

// Contact schema and model (contacts collection)
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    newsletter: Boolean,
    date: { type: Date, default: Date.now }
}, { collection: 'contacts' });
const Contact = mongoose.model('Contact', contactSchema);

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ success: true, user: { email: user.email } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        const newUser = new User({ email, password });
        await newUser.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, { email: 1, _id: 0 });
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add item to cart
app.post('/api/cart/add', async (req, res) => {
    const { email, item } = req.body;
    try {
        let cart = await Cart.findOne({ email });
        if (!cart) {
            cart = new Cart({ email, items: [item] });
        } else {
            const existingItem = cart.items.find(i => i.name === item.name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push(item);
            }
        }
        await cart.save();
        res.json({ success: true, cart });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Clear cart endpoint
app.post('/api/cart/clear', async (req, res) => {
    const { email } = req.body;
    try {
        await Cart.findOneAndUpdate({ email }, { items: [] });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get cart items
app.get('/api/cart', async (req, res) => {
    const email = req.query.email;
    try {
        const cart = await Cart.findOne({ email });
        res.json({ success: true, cart: cart ? cart.items : [] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});