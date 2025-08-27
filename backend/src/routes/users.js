const express = require('express');
const { User } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// List all users except current user
router.get('/', auth, async (req, res) => {
  const me = req.user.id;
  const users = await User.findAll({
    where: { id: { [require('sequelize').Op.ne]: me } },
    attributes: ['id', 'username', 'email']
  });
  res.json(users);
});

module.exports = router;
