const express = require('express');
const router = express.Router();

const { createCampaign, listCampaigns } = require('../handlers/campaignHandlers');
const { protect } = require('../middleware/authmiddleware'); 

router.post('/create', protect, createCampaign);
router.get('/list', protect, listCampaigns);

console.log('campaign route ready');

module.exports = router;
