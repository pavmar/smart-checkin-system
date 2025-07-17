const express = require('express');
const Joi = require('joi');
const { checkinQueries, userQueries } = require('../database/database');

const router = express.Router();

// Validation schemas
const checkinSchema = Joi.object({
  userId: Joi.string().required(),
  location: Joi.string().max(100).optional(),
  notes: Joi.string().max(500).optional(),
});

// Check in a user
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = checkinSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message,
      });
    }

    // Verify user exists
    const user = await userQueries.findByUniqueId(value.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Create check-in record
    const result = await checkinQueries.create(value);
    
    res.status(201).json({
      message: 'Check-in successful',
      data: {
        id: result.id,
        userId: value.userId,
        userName: `${user.first_name} ${user.last_name}`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating check-in:', error);
    res.status(500).json({
      error: 'Failed to check in user',
      details: error.message,
    });
  }
});

// Get check-in history for a specific user
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required',
      });
    }

    // Verify user exists
    const user = await userQueries.findByUniqueId(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const checkins = await checkinQueries.getByUserId(userId);
    
    // Format check-in data
    const checkinsData = checkins.map(checkin => ({
      id: checkin.id,
      userId: checkin.user_id,
      checkinTime: checkin.checkin_time,
      location: checkin.location,
      notes: checkin.notes,
      userName: `${checkin.first_name} ${checkin.last_name}`,
      userMobile: checkin.mobile,
    }));

    res.json({
      message: 'Check-in history retrieved successfully',
      data: checkinsData,
      count: checkinsData.length,
      user: {
        uniqueId: user.unique_id,
        name: `${user.first_name} ${user.last_name}`,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error('Error fetching check-in history:', error);
    res.status(500).json({
      error: 'Failed to fetch check-in history',
      details: error.message,
    });
  }
});

// Get all check-ins (admin view)
router.get('/all', async (req, res) => {
  try {
    const checkins = await checkinQueries.getAll();
    
    // Format check-in data
    const checkinsData = checkins.map(checkin => ({
      id: checkin.id,
      userId: checkin.user_id,
      checkinTime: checkin.checkin_time,
      location: checkin.location,
      notes: checkin.notes,
      userName: `${checkin.first_name} ${checkin.last_name}`,
      userMobile: checkin.mobile,
    }));

    res.json({
      message: 'All check-ins retrieved successfully',
      data: checkinsData,
      count: checkinsData.length,
    });
  } catch (error) {
    console.error('Error fetching all check-ins:', error);
    res.status(500).json({
      error: 'Failed to fetch check-ins',
      details: error.message,
    });
  }
});

// Get today's check-ins
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkins = await checkinQueries.getAll();
    
    // Filter today's check-ins
    const todayCheckins = checkins.filter(checkin => {
      const checkinDate = new Date(checkin.checkin_time);
      return checkinDate >= today && checkinDate < tomorrow;
    });

    // Format check-in data
    const checkinsData = todayCheckins.map(checkin => ({
      id: checkin.id,
      userId: checkin.user_id,
      checkinTime: checkin.checkin_time,
      location: checkin.location,
      notes: checkin.notes,
      userName: `${checkin.first_name} ${checkin.last_name}`,
      userMobile: checkin.mobile,
    }));

    res.json({
      message: "Today's check-ins retrieved successfully",
      data: checkinsData,
      count: checkinsData.length,
      date: today.toISOString().split('T')[0],
    });
  } catch (error) {
    console.error("Error fetching today's check-ins:", error);
    res.status(500).json({
      error: "Failed to fetch today's check-ins",
      details: error.message,
    });
  }
});

// Get check-in statistics
router.get('/stats', async (req, res) => {
  try {
    const allCheckins = await checkinQueries.getAll();
    const allUsers = await userQueries.getAll();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCheckins = allCheckins.filter(checkin => {
      const checkinDate = new Date(checkin.checkin_time);
      return checkinDate >= today && checkinDate < tomorrow;
    });

    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekCheckins = allCheckins.filter(checkin => {
      const checkinDate = new Date(checkin.checkin_time);
      return checkinDate >= thisWeek;
    });

    res.json({
      message: 'Check-in statistics retrieved successfully',
      data: {
        totalUsers: allUsers.length,
        totalCheckins: allCheckins.length,
        todayCheckins: todayCheckins.length,
        weekCheckins: weekCheckins.length,
        averageCheckinsPerDay: (allCheckins.length / Math.max(1, Math.ceil((Date.now() - new Date(allUsers[0]?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(2),
      },
    });
  } catch (error) {
    console.error('Error fetching check-in statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      details: error.message,
    });
  }
});

module.exports = router;
