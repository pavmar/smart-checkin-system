const express = require('express');
const Joi = require('joi');
const { userQueries } = require('../database/database');

const router = express.Router();

// Validation schemas
const userRegistrationSchema = Joi.object({
  uniqueId: Joi.string().required(),
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  mobile: Joi.string().pattern(/^\d{10}$/).required(),
  email: Joi.string().email().required(),
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = userRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message,
      });
    }

    // Check if user already exists (by unique ID or mobile)
    const existingUserById = await userQueries.findByUniqueId(value.uniqueId);
    if (existingUserById) {
      return res.status(409).json({
        error: 'User already exists with this ID',
      });
    }

    const existingUserByMobile = await userQueries.findByMobile(value.mobile);
    if (existingUserByMobile) {
      return res.status(409).json({
        error: 'User already exists with this mobile number',
      });
    }

    // Create new user
    const result = await userQueries.create(value);
    
    res.status(201).json({
      message: 'User registered successfully',
      data: {
        id: result.id,
        uniqueId: result.uniqueId,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      error: 'Failed to register user',
      details: error.message,
    });
  }
});

// Get user by unique ID
router.get('/:uniqueId', async (req, res) => {
  try {
    const { uniqueId } = req.params;
    
    if (!uniqueId) {
      return res.status(400).json({
        error: 'User ID is required',
      });
    }

    const user = await userQueries.findByUniqueId(uniqueId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Convert snake_case to camelCase for frontend
    const userData = {
      id: user.id,
      uniqueId: user.unique_id,
      firstName: user.first_name,
      lastName: user.last_name,
      mobile: user.mobile,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    res.json({
      message: 'User found',
      data: userData,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      details: error.message,
    });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await userQueries.getAll();
    
    // Convert snake_case to camelCase for frontend
    const usersData = users.map(user => ({
      id: user.id,
      uniqueId: user.unique_id,
      firstName: user.first_name,
      lastName: user.last_name,
      mobile: user.mobile,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));

    res.json({
      message: 'Users retrieved successfully',
      data: usersData,
      count: usersData.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      details: error.message,
    });
  }
});

// Search users by mobile number
router.get('/search/mobile/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;
    
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        error: 'Valid 10-digit mobile number is required',
      });
    }

    const user = await userQueries.findByMobile(mobile);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found with this mobile number',
      });
    }

    // Convert snake_case to camelCase for frontend
    const userData = {
      id: user.id,
      uniqueId: user.unique_id,
      firstName: user.first_name,
      lastName: user.last_name,
      mobile: user.mobile,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    res.json({
      message: 'User found',
      data: userData,
    });
  } catch (error) {
    console.error('Error searching user by mobile:', error);
    res.status(500).json({
      error: 'Failed to search user',
      details: error.message,
    });
  }
});

module.exports = router;
