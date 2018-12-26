// const campaigns = require('./routes/campaigns');
const { Campaign, validate } = require('./models/Campaigns');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect(process.env.ad_db || 'mongodb://localhost/adnetwork', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('console');
});

app.post('/', (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const campaign = new Campaign({
    campaignName: req.body.campaignName,
    advertiser: req.body.advertiser,
    targets: req.body.targets,
    conversionType: req.body.conversionType,
    bid: req.body.bid
  });
  campaign.save()
    .then(result => res.render('console', {
      message: result ? 'success' : 'fail',
      campaign: req.body.campaignName
    }))
    .catch(err => res.status(500).send('Something failed!'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));