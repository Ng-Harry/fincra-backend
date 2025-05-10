require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const FINCRA_SECRET_KEY = process.env.FINCRA_SECRET_KEY;

app.post('/api/initiate-payment', async (req, res) => {
  const { name, email, amount, currency } = req.body;

  try {
    const response = await axios.post(
      'https://sandboxapi.fincra.com/checkout/payments',
      {
        amount,
        currency,
        customer: { name, email },
        redirectUrl: 'https://your-frontend.vercel.app/payment-success',
      },
      {
        headers: {
          Authorization: `Bearer ${FINCRA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ paymentLink: response.data?.data?.link });
  } catch (err) {
    const status = err.response?.status || 500;
    const errorMessage = err.response?.data || { message: 'Fincra request failed.' };
    console.error('Fincra Error:', errorMessage);
    res.status(status).json({ error: errorMessage });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
