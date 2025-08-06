const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Використовуємо порт із змінної середовища або 4000 за замовчуванням
const PORT = process.env.PORT || 4000;

// Приймаємо JSON у тілі запиту
app.use(express.json());

// Дозволяємо CORS (заміни origin на адресу фронтенда)
app.use(cors({
  origin: '*', // для тесту можна так, а потім звузити до фронтенда
}));

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

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
