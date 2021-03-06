const { Campaign } = require('./models/Campaigns');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/adnetwork', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connected to MongoDB...'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/fetch', async (req, res) => {
  console.log(req.query.country);

  if (!req.query.country) return res.status(400).send('Bad request');

  try {
    const campaign = await Campaign
      .find({ targets: { $in: req.query.country } })
      .sort('-bid')
      .limit(1)
      .select('campaignName advertiser bid conversionType -_id');

    if (!campaign) return res.status(404).send('There is no campaign available to this country.');

    res.send(campaign);
  } catch (err) {
    res.status(500).send('Something failed.');
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));