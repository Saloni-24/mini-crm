const Campaign = require('../data/campaign');
const Customer = require('../data/customer');

// Helper function to convert rules into MongoDB query filter with logic (AND/OR)
const buildFilter = (rules, logic = 'AND') => {
  if (!Array.isArray(rules)) return {};

  const allowedFields = ['spend', 'visits'];

  const conditions = rules
    .map(rule => {
      let operatorMongo;
      switch (rule.operator) {
        case ">": operatorMongo = "$gt"; break;
        case "<": operatorMongo = "$lt"; break;
        case ">=": operatorMongo = "$gte"; break;
        case "<=": operatorMongo = "$lte"; break;
        case "==": operatorMongo = "$eq"; break;
        case "!=": operatorMongo = "$ne"; break;
        default: return null; // unsupported operator
      }

      if (!allowedFields.includes(rule.field)) return null; // invalid field

      return { [rule.field]: { [operatorMongo]: rule.value } };
    })
    .filter(Boolean);

  if (logic === 'AND') return { $and: conditions };
  else if (logic === 'OR') return { $or: conditions };
  else return { $and: conditions }; // fallback default
};

const createCampaign = async (req, res) => {
  try {
    const { name, rules, message, logic } = req.body;

    if (!name || !rules || !message || !logic) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({ msg: 'Rules must be a non-empty array' });
    }

    // Validate each rule has required fields
    for (const rule of rules) {
      if (!rule.field || !rule.operator || rule.value === undefined) {
        return res.status(400).json({ msg: 'Each rule must have field, operator, and value' });
      }
    }

    if (!['AND', 'OR'].includes(logic)) {
      return res.status(400).json({ msg: "Logic must be 'AND' or 'OR'" });
    }

    const filter = buildFilter(rules, logic);
    const customers = await Customer.find(filter);

    const newCampaign = new Campaign({
      name,
      rules,
      logic,
      message,
      audienceSize: customers.length,
      status: 'CREATED',
      sent: 0,
      failed: 0,
    });

    await newCampaign.save();

    console.log(`[ Campaign Created ] Name: ${name} | Audience: ${customers.length} | Rules: ${rules.length}`);
    res.status(201).json({ msg: 'Campaign created', campaign: newCampaign });
  } catch (err) {
    console.log('Error in creating campaign:', err.message);
    res.status(500).json({ msg: 'Some trouble in the server' });
  }
};

const listCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    console.log('Loaded all campaigns');
    res.status(200).json({ campaigns });
  } catch (err) {
    console.log('Error while loading campaigns:', err.message);
    res.status(500).json({ msg: 'Trouble in server' });
  }
};

// POST /campaigns/preview
const previewCampaign = async (req, res) => {
  try {
    const { rules, logic } = req.body;

    if (!rules || !Array.isArray(rules) || !logic) {
      return res.status(400).json({ msg: 'Rules and logic required' });
    }

    if (!['AND', 'OR'].includes(logic)) {
      return res.status(400).json({ msg: "Logic must be 'AND' or 'OR'" });
    }

    const filter = buildFilter(rules, logic);
    const audienceSize = await Customer.countDocuments(filter);

    res.status(200).json({ audienceSize });
  } catch (err) {
    console.log('Error in previewCampaign:', err.message);
    res.status(500).json({ msg: 'Server error in preview' });
  }
};

// POST /campaigns/:id/send
const sendCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });

    const filter = buildFilter(campaign.rules, campaign.logic);
    const customers = await Customer.find(filter);

    // Simulate sending: all succeed, failed = 0
    const sent = customers.length;
    const failed = 0;

    campaign.status = 'SENT';
    campaign.sent = sent;
    campaign.failed = failed;
    campaign.deliveredAt = new Date();

    await campaign.save();

    console.log(`Campaign "${campaign.name}" sent to ${sent} customers.`);
    res.status(200).json({ msg: 'Campaign delivered', sent, failed });
  } catch (err) {
    console.log('Error in sendCampaign:', err.message);
    res.status(500).json({ msg: 'Server error sending campaign' });
  }
};

// GET /campaigns/all - summary list
const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({})
      .sort({ createdAt: -1 })
      .select('name status audienceSize sent failed createdAt');

    res.status(200).json(campaigns);
  } catch (err) {
    console.log('Error in getAllCampaigns:', err.message);
    res.status(500).json({ msg: 'Server error fetching campaigns' });
  }
};

module.exports = {
  createCampaign,
  listCampaigns,
  previewCampaign,
  sendCampaign,
  getAllCampaigns,
};
