require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Fincra } = require('fincra-node-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Instantiate Fincra
const fincra = new Fincra(
  process.env.FINCRA_PUBLIC_KEY,
  process.env.FINCRA_PRIVATE_KEY,
  { sandbox: true }
);

app.post('/api/initiate-payment', async (req, res) => {
  const { name, email, amount, currency } = req.body;

  try {
    const result = await fincra.checkout.initiatePayment({
      amount,
      currency,
      customer: {
        name,
        email
      },
      redirectUrl: 'http://localhost:5173/payment-success',
    });

    res.json({ paymentLink: result?.data?.link });
  } catch (err) {
    console.error('Fincra SDK error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

app.listen(8000, () => console.log('✅ Backend running on http://localhost:8000'));
