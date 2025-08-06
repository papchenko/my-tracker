const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Дозволені адреси фронтенду для CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://1568c40e270f.ngrok-free.app/'
];

app.use(express.json());

app.use(cors({
  origin: function(origin, callback){
    // Якщо запит із non-browser клієнта (origin === undefined), дозволяємо
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'CORS policy: доступ із цього origin заборонений.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Для перевірки роботи сервера (можна видалити пізніше)
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Ендпоінт для збереження кроків
app.post('/save-steps', (req, res) => {
  const data = req.body;

  if (!data || typeof data.steps !== 'number') {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const filePath = path.join(__dirname, 'steps.json');

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing file', err);
      return res.status(500).json({ error: 'Failed to write file' });
    }

    res.json({ message: 'Steps saved successfully' });
  });
});

// Запуск сервера на всіх інтерфейсах
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
