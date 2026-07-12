import express from 'express';
import Calculation from '../models/Calculation.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { dateOfBirth, results } = req.body;
    const calculation = await Calculation.create({
      user: req.user._id,
      dateOfBirth,
      results,
    });
    res.status(201).json({ success: true, data: calculation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const calculations = await Calculation.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: calculations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const calculation = await Calculation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!calculation) {
      return res
        .status(404)
        .json({ success: false, message: 'Calculation not found' });
    }
    res.json({ success: true, data: calculation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const calculation = await Calculation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!calculation) {
      return res
        .status(404)
        .json({ success: false, message: 'Calculation not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
