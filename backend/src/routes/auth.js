const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();
require('dotenv').config();
const refreshTokensStore = new Map();
function signAccess(user){ return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }); }
function signRefresh(user){ return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }); }
router.post('/register', async (req,res)=>{ const { username, email, password } = req.body; if (!username||!email||!password) return res.status(400).json({ message: 'Missing fields' }); const exists = await User.findOne({ where: { email } }); if (exists) return res.status(409).json({ message: 'Email already registered' }); const hash = await bcrypt.hash(password, 10); const user = await User.create({ username, email, passwordHash: hash }); const access = signAccess(user); const refresh = signRefresh(user); refreshTokensStore.set(refresh, user.id); res.json({ accessToken: access, refreshToken: refresh, user: { id: user.id, username: user.username, email: user.email } }); });
router.post('/login', async (req,res)=>{ const { email, password } = req.body; if (!email||!password) return res.status(400).json({ message: 'Missing fields' }); const user = await User.findOne({ where: { email } }); if (!user) return res.status(401).json({ message: 'Invalid credentials' }); const ok = await bcrypt.compare(password, user.passwordHash); if (!ok) return res.status(401).json({ message: 'Invalid credentials' }); const access = signAccess(user); const refresh = signRefresh(user); refreshTokensStore.set(refresh, user.id); res.json({ accessToken: access, refreshToken: refresh, user: { id: user.id, username: user.username, email: user.email } }); });
module.exports = router;
