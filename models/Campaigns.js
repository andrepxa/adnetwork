const Joi = require('joi');
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  advertiser: {
    type: String,
    required: true
  },
  campaignName: {
    type: String,
    required: true
  },
  targets: {
    type: [String],
    default: ['']
  },
  conversionType: {
    type: String,
    required: true,
    lowercase: true
  },
  bid: {
    type: Number,
    required: true,
    min: 0
  }
});

const Campaign = mongoose.model('campaigns', campaignSchema);

function validateCampaign(campaign) {
  const schema = {
    advertiser: Joi.string().min(3).required(),
    campaignName: Joi.string().min(3).required(),
    targets: Joi.array().min(1),
    conversionType: Joi.string().required(),
    bid: Joi.number().min(0)
  };

  return Joi.validate(campaign, schema);
}

exports.Campaign = Campaign;
exports.validate = validateCampaign;