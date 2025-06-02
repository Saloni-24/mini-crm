const Campaign = require('../data/campaign');
const Customer = require('../data/customer');

const createCampaign = async (req, res) => {
  try {
    const { name, rules, message } = req.body;

    if (!name || !rules || !message) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    // find customers whcih matches to the rules
    const customers = await Customer.find(rules);

    // create new campaign
    const newCampaign = new Campaign({
      name,
      rules,
      message,
      audienceSize: customers.length,
    });

    await newCampaign.save();

    console.log('Campaign created:', name);
    res.status(201).json({ msg: 'Campaign created', campaign: newCampaign });
  } catch (err) {
    console.log('Error in creating campaign:', err.message);
    res.status(500).json({ msg: 'Some trouble in the server' });
  }
};

const listCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    console.log('For all campaign');
    res.status(200).json({ campaigns });
  } catch (err) {
    console.log('Error while loading campaign:', err.message);
    res.status(500).json({ msg: 'Trouble in server' });
  }
};

module.exports = {
  createCampaign,
  listCampaigns,
};
