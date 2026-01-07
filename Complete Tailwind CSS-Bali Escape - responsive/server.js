const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sequelize = require('./database');
const User = require('./models/User');
const Destination = require('./models/Destination');
const Message = require('./models/Message');
const Accommodation = require('./models/Accommodation');
const Guide = require('./models/Guide');
const Vehicle = require('./models/Vehicle');

// Define associations
User.hasMany(Destination, { foreignKey: 'userId' });
Destination.belongsTo(User, { foreignKey: 'userId' });

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'src', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src')));
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Database Synchronization
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Failed to sync database:', err);
});

const bcrypt = require('bcrypt');

// --- API ROUTES ---

// 1. Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists. Please choose a different username.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Force role to 'user' if not provided or if we want to restrict admin creation
        // For now, we allow it if sent, but frontend will remove the option.
        const user = await User.create({ username, password: hashedPassword, role: role || 'user' });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username, password }); // Debug log
        const user = await User.findOne({ where: { username } });
        console.log('User found:', user ? user.username : 'null'); // Debug log
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        res.json({ message: 'Login successful', user: { id: user.id, username: user.username, role: user.role, points: user.points, profilePicture: user.profilePicture } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Routes
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'username', 'role', 'points', 'profilePicture']
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/:id', upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (req.file) {
            user.profilePicture = '/uploads/' + req.file.filename;
        }

        await user.save();

        res.json({ message: 'Profile updated', user: { id: user.id, username: user.username, role: user.role, points: user.points, profilePicture: user.profilePicture } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Destination Routes
app.get('/api/destinations', async (req, res) => {
    try {
        const { userId, status } = req.query;
        const where = {};
        if (userId) where.userId = userId;
        if (status) where.status = status;

        const destinations = await Destination.findAll({
            where,
            include: [{ model: User, attributes: ['username', 'profilePicture'] }]
        });
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/destinations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await Destination.findByPk(id, {
            include: [{ model: User, attributes: ['username', 'profilePicture'] }]
        });
        if (!destination) return res.status(404).json({ error: 'Destination not found' });
        res.json(destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/destinations', upload.single('image'), async (req, res) => {
    try {
        const { userId, title, description, price, submitterName, category, area, address, longDescription, hours, tips, mapUrl } = req.body;
        let imageUrl = '';
        if (req.file) {
            imageUrl = '/uploads/' + req.file.filename;
        }

        const destination = await Destination.create({
            title, description, imageUrl, price, userId, submitterName, status: 'pending', category, area, address, longDescription, hours, tips, mapUrl
        });

        if (userId) {
            const user = await User.findByPk(userId);
            if (user) {
                user.points += 10; // Add points for submission
                await user.save();
            }
        }

        res.status(201).json(destination);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/destinations/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status, title, description, price, category, area, address, longDescription, hours, tips, mapUrl } = req.body;

        const destination = await Destination.findByPk(id);
        if (!destination) return res.status(404).json({ error: 'Destination not found' });

        if (status) destination.status = status;
        if (title) destination.title = title;
        if (description) destination.description = description;
        if (price) destination.price = price;
        if (category) destination.category = category;
        if (area) destination.area = area;
        if (address) destination.address = address;
        if (longDescription) destination.longDescription = longDescription;
        if (hours) destination.hours = hours;
        if (tips) destination.tips = tips;
        if (mapUrl) destination.mapUrl = mapUrl;
        if (req.file) {
            destination.imageUrl = '/uploads/' + req.file.filename;
        }

        await destination.save();
        res.json(destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/destinations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Destination.destroy({ where: { id } });
        res.json({ message: 'Destination deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Message Routes
app.post('/api/messages', async (req, res) => {
    try {
        console.log('Received message:', req.body); // Debug log
        const message = await Message.create(req.body);
        console.log('Message saved:', message); // Debug log
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving message:', error); // Debug log
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.findAll();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Accommodation Routes
app.get('/api/accommodations', async (req, res) => {
    try {
        const accommodations = await Accommodation.findAll();
        res.json(accommodations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/accommodations', async (req, res) => {
    try {
        const { name, type, area, priceRange, description, rating, features, bookingUrl } = req.body;
        const accommodation = await Accommodation.create({
            name, type, area, priceRange, description, rating, features, bookingUrl
        });
        res.status(201).json(accommodation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/accommodations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, area, priceRange, description, rating, features, bookingUrl } = req.body;

        const accommodation = await Accommodation.findByPk(id);
        if (!accommodation) return res.status(404).json({ error: 'Accommodation not found' });

        if (name) accommodation.name = name;
        if (type) accommodation.type = type;
        if (area) accommodation.area = area;
        if (priceRange) accommodation.priceRange = priceRange;
        if (description) accommodation.description = description;
        if (rating) accommodation.rating = rating;
        if (features) accommodation.features = features;
        if (bookingUrl !== undefined) accommodation.bookingUrl = bookingUrl;

        await accommodation.save();
        res.json(accommodation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/accommodations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Accommodation.destroy({ where: { id } });
        res.json({ message: 'Accommodation deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Guide Routes
app.get('/api/guides', async (req, res) => {
    try {
        const guides = await Guide.findAll();
        res.json(guides);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/guides/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const guide = await Guide.findOne({ where: { slug } });
        if (!guide) return res.status(404).json({ error: 'Guide not found' });
        res.json(guide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/guides', upload.single('image'), async (req, res) => {
    try {
        const { title, slug, category, excerpt, content, readTime } = req.body;
        let imageUrl = '';
        if (req.file) {
            imageUrl = '/uploads/' + req.file.filename;
        }

        const guide = await Guide.create({
            title, slug, category, excerpt, content, readTime, imageUrl
        });
        res.status(201).json(guide);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/guides/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, category, excerpt, content, readTime } = req.body;

        const guide = await Guide.findByPk(id);
        if (!guide) return res.status(404).json({ error: 'Guide not found' });

        if (title) guide.title = title;
        if (slug) guide.slug = slug;
        if (category) guide.category = category;
        if (excerpt) guide.excerpt = excerpt;
        if (content) guide.content = content;
        if (readTime) guide.readTime = readTime;
        if (req.file) {
            guide.imageUrl = '/uploads/' + req.file.filename;
        }

        await guide.save();
        res.json(guide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/guides/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Guide.destroy({ where: { id } });
        res.json({ message: 'Guide deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Vehicle Routes
app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/vehicles', async (req, res) => {
    try {
        const { name, area, type, price, description, contact, whatsapp, features, rating } = req.body;
        const vehicle = await Vehicle.create({
            name, area, type, price, description, contact, whatsapp, features, rating
        });
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/vehicles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, area, type, price, description, contact, whatsapp, features, rating } = req.body;

        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

        if (name) vehicle.name = name;
        if (area) vehicle.area = area;
        if (type) vehicle.type = type;
        if (price) vehicle.price = price;
        if (description) vehicle.description = description;
        if (contact) vehicle.contact = contact;
        if (whatsapp) vehicle.whatsapp = whatsapp;
        if (features) vehicle.features = features;
        if (rating) vehicle.rating = rating;

        await vehicle.save();
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/vehicles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Vehicle.destroy({ where: { id } });
        res.json({ message: 'Vehicle deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 4. Accommodation Routes
app.get('/api/accommodations', async (req, res) => {
    try {
        const accommodations = await Accommodation.findAll();
        res.json(accommodations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/accommodations', async (req, res) => {
    try {
        const { name, type, area, priceRange, description, rating, features, bookingUrl } = req.body;
        const accommodation = await Accommodation.create({
            name, type, area, priceRange, description, rating, features, bookingUrl
        });
        res.status(201).json(accommodation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/accommodations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, area, priceRange, description, rating, features, bookingUrl } = req.body;

        const accommodation = await Accommodation.findByPk(id);
        if (!accommodation) return res.status(404).json({ error: 'Accommodation not found' });

        if (name) accommodation.name = name;
        if (type) accommodation.type = type;
        if (area) accommodation.area = area;
        if (priceRange) accommodation.priceRange = priceRange;
        if (description) accommodation.description = description;
        if (rating) accommodation.rating = rating;
        if (features) accommodation.features = features;
        if (bookingUrl !== undefined) accommodation.bookingUrl = bookingUrl;

        await accommodation.save();
        res.json(accommodation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/accommodations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Accommodation.destroy({ where: { id } });
        res.json({ message: 'Accommodation deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Guide Routes
app.get('/api/guides', async (req, res) => {
    try {
        const guides = await Guide.findAll();
        res.json(guides);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/guides/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const guide = await Guide.findOne({ where: { slug } });
        if (!guide) return res.status(404).json({ error: 'Guide not found' });
        res.json(guide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/guides', upload.single('image'), async (req, res) => {
    try {
        const { title, slug, category, excerpt, content, readTime } = req.body;
        let imageUrl = '';
        if (req.file) {
            imageUrl = '/uploads/' + req.file.filename;
        }

        const guide = await Guide.create({
            title, slug, category, excerpt, content, readTime, imageUrl
        });
        res.status(201).json(guide);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/guides/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, category, excerpt, content, readTime } = req.body;

        const guide = await Guide.findByPk(id);
        if (!guide) return res.status(404).json({ error: 'Guide not found' });

        if (title) guide.title = title;
        if (slug) guide.slug = slug;
        if (category) guide.category = category;
        if (excerpt) guide.excerpt = excerpt;
        if (content) guide.content = content;
        if (readTime) guide.readTime = readTime;
        if (req.file) {
            guide.imageUrl = '/uploads/' + req.file.filename;
        }

        await guide.save();
        res.json(guide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/guides/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Guide.destroy({ where: { id } });
        res.json({ message: 'Guide deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Vehicle Routes
app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/vehicles', async (req, res) => {
    try {
        const { name, area, type, price, description, contact, whatsapp, features, rating } = req.body;
        const vehicle = await Vehicle.create({
            name, area, type, price, description, contact, whatsapp, features, rating
        });
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/vehicles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, area, type, price, description, contact, whatsapp, features, rating } = req.body;

        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

        if (name) vehicle.name = name;
        if (area) vehicle.area = area;
        if (type) vehicle.type = type;
        if (price) vehicle.price = price;
        if (description) vehicle.description = description;
        if (contact) vehicle.contact = contact;
        if (whatsapp) vehicle.whatsapp = whatsapp;
        if (features) vehicle.features = features;
        if (rating) vehicle.rating = rating;

        await vehicle.save();
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/vehicles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Vehicle.destroy({ where: { id } });
        res.json({ message: 'Vehicle deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
