const express = require('express');
const router = express.Router();

const {
  createCampaign,
  listCampaigns,
  previewCampaign,
  sendCampaign,
  getAllCampaigns,
} = require('../handlers/campaignHandlers');

const { protect } = require('../middleware/authmiddleware');

// Import delivery log handler
const { getDeliveryLogsByCampaign } = require('../handlers/campaignDeliveryHandler');

// Campaign create route
router.post('/create', protect, createCampaign);

// List campaigns (old route)
router.get('/list', protect, listCampaigns);

// New route for previewing audience size
router.post('/preview', protect, previewCampaign);

// New route for sending campaign by id
router.post('/:id/send', protect, sendCampaign);

// New route for getting all campaigns 
router.get('/', protect, getAllCampaigns);

// New route: Get delivery logs for a campaign
router.get('/:id/delivery-logs', protect, getDeliveryLogsByCampaign);

console.log('Campaign routes ready!');

module.exports = router;
