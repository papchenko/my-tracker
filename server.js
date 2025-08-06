const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Використовуємо порт із змінної середовища або 4000 за замовчуванням
const PORT = process.env.PORT || 4000;

// Приймаємо JSON у тілі запиту
app.use(express.json());

// Дозволяємо CORS (на Railway краще явно вказати фронтенд)
app.use(cors({
  origin: '*', // для тесту можна так, але на проді краще обмежити
}));

// Перевірка доступності сервера
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

    console.log(`Saved steps: ${data.steps} at ${data.timestamp}`);
    res.json({ message: 'Steps saved successfully' });
  });
});

// Запуск сервера на Railway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
