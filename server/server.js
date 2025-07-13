// server/server.js — Node.js сервер с Telegram-уведомлением

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram bot config
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/contact', async (req, res) => {
  const { name, child, phone, message } = req.body;

  if (!name || !child || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const text = `📩 Новая заявка:
👤 Родитель: ${name}
👶 Ребёнок: ${child}
📞 Телефон: ${phone}
📝 Комментарий: ${message || '—'}`;

  try {
    await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    res.status(200).json({ message: 'OK' });
  } catch (err) {
    console.error('Ошибка Telegram:', err);
    res.status(500).json({ error: 'Telegram error' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});