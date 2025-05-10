require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Fincra } = require('fincra-node-sdk');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Load Fincra credentials from environment variables
const PUBLIC_KEY = process.env.FINCRA_PUBLIC_KEY;
const PRIVATE_KEY = process.env.FINCRA_PRIVATE_KEY;

if (!PUBLIC_KEY || !PRIVATE_KEY) {
  console.error("❌ Fincra keys missing. Check your .env file.");
  process.exit(1);
}

console.log("✅ Loaded Fincra keys.");

// Initialize Fincra SDK
const fincra = new Fincra(PUBLIC_KEY, PRIVATE_KEY, { sandbox: true });

app.post('/api/initiate-payment', async (req, res) => {
  const { name, email, amount, currency } = req.body;

  if (!name || !email || !amount || !currency) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const result = await fincra.checkout.initiatePayment({
      amount,
      currency,
      customer: { name, email },
      redirectUrl: process.env.REDIRECT_URL || 'http://localhost:5173/payment-success',
    });

    res.json({ paymentLink: result?.data?.link });
  } catch (err) {
    console.error('❌ Fincra SDK error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || 'Failed to initiate payment' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
