const express = require('express');
const { Conversation, Message } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();
const { Op } = require('sequelize');
router.get('/', auth, async (req,res)=>{ const userId = req.user.id; const convs = await Conversation.findAll({ where: { [Op.or]: [{ user1Id: userId }, { user2Id: userId }] }, include: [{ model: Message, limit: 1, order: [['createdAt','DESC']] }], order: [['lastMessageAt','DESC']] }); res.json(convs); });
router.post('/start', auth, async (req,res)=>{ const { otherUserId } = req.body; const me = req.user.id; if (!otherUserId || otherUserId === me) return res.status(400).json({ message: 'Invalid otherUserId' }); const [user1Id,user2Id] = me < otherUserId ? [me,otherUserId] : [otherUserId,me]; let conv = await Conversation.findOne({ where: { user1Id,user2Id }}); if (!conv) conv = await Conversation.create({ user1Id,user2Id, lastMessageAt: new Date() }); res.json(conv); });
module.exports = router;
