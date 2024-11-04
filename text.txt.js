const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash the password before saving it
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register User
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

//product Schema
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
});

module.exports = mongoose.model('Product', productSchema);

//Authorized Middlware
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token = req.header('Authorization');

  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  } else {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded.userId; // Attach user ID to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

//protected routes for user specific data 
const Product = require('../models/Product');

// Create a product
app.post('/api/products', protect, async (req, res) => {
  const { name, description } = req.body;

  try {
    const product = new Product({ name, description, user: req.user });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products for the logged-in user
app.get('/api/products', protect, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//frontend
import { useState } from 'react';
import axios from 'axios';

const Login = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('authToken', data.token);
      history.push('/dashboard');
    } catch (error) {
      console.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

//view user data
import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/products', config);
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Your Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - {product.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

//logout
const Logout = ({ history }) => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    history.push('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;


//Update and edit
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String }, // Optional profile image
});

const User = mongoose.model('User', userSchema);
module.exports = User;

const User = require('../models/User');

// Update user profile
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  let profileImage = req.file ? req.file.path : null;

  try {
    const user = await User.findById(req.user); // req.user is set by authentication middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    user.name = name || user.name;
    user.email = email || user.email;
    if (profileImage) {
      user.profileImage = profileImage; // Update profile image if a new one is uploaded
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

//routes
const express = require('express');
const { updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); // For profile image uploads

const router = express.Router();

// Update profile route
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

module.exports = router;

//jwt authorized
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, 'your_jwt_secret');
      req.user = decoded.userId; // Add the user ID to the request

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

//multer
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store profile images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });
module.exports = upload;

//../utils/api.js
import axios from 'axios';

const updateUserProfile = async (userData) => {
  const token = localStorage.getItem('authToken'); // JWT token

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Required when sending file data
    },
  };

  try {
    const response = await axios.put('/api/profile', userData, config);
    console.log('Profile updated', response.data);
  } catch (error) {
    console.error('Error updating profile', error);
  }
};

//edit profile
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to import axios
import { updateUserProfile } from './userApi'; // If the function is in a separate file

const EditProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileImage: null,
  });
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Fetch the user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken'); // Get JWT token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const { data } = await axios.get('/api/profile', config); // Fetch current user info
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file input for profile image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserData((prevData) => ({ ...prevData, profileImage: file }));
    setProfileImagePreview(URL.createObjectURL(file)); // Show preview of the uploaded image
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle multipart data (files + text)
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    if (userData.profileImage) {
      formData.append('profileImage', userData.profileImage);
    }

    // Call the updateUserProfile function
    await updateUserProfile(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input type="text" name="name" value={userData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" value={userData.email} onChange={handleChange} />
      </div>
      <div>
        <label>Profile Image</label>
        <input type="file" name="profileImage" onChange={handleFileChange} />
        {profileImagePreview && <img src={profileImagePreview} alt="Profile Preview" width="100" />}
      </div>
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default EditProfile;


//multer
import React, { useState } from 'react';
import axios from 'axios';

const CsvUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('authToken'); // Assuming JWT authentication
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // If your routes are protected
        },
      };

      await axios.post('/api/upload-csv', formData, config);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file', error);
      alert('File upload failed!');
    }
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default CsvUpload;

const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const User = require('./models/User'); // Import your Mongoose model

const router = express.Router();

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // 'uploads/' is the folder where files are stored temporarily

// POST route to upload CSV file
router.post('/upload-csv', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const users = [];

    // Read the CSV file and parse the data
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Assuming the CSV has columns 'name', 'email', 'isActive'
        users.push({
          name: row.name,
          email: row.email,
          isActive: row.isActive === 'true', // Convert string to boolean
        });
      })
      .on('end', async () => {
        // Insert the data into the database
        try {
          await User.insertMany(users);
          res.status(200).json({ message: 'CSV data uploaded successfully!' });
        } catch (err) {
          console.error('Error saving data to database:', err);
          res.status(500).json({ message: 'Database error' });
        } finally {
          // Remove the uploaded file after processing
          fs.unlinkSync(filePath);
        }
      });
  } catch (error) {
    console.error('Error uploading CSV:', error);
    res.status(500).json({ message: 'Error processing CSV file' });
  }
});

module.exports = router;

const express = require('express');
const csvUploadRoutes = require('./routes/csvUploadRoutes'); // Path to the CSV upload routes

const app = express();

// Other middlewares like bodyParser, cors, etc.
app.use('/api', csvUploadRoutes); // Register the CSV upload routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
