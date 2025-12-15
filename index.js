import express from 'express';
import multer from 'multer';
import fs from 'fs';
import crypto from 'crypto';
import cors from 'cors';

const app = express(); // ✅ PRIMERO se inicializa app

app.use(cors());
app.use(express.json());

// 🔹 ENDPOINT DE PRUEBA (AHORA SÍ está bien ubicado)
app.get('/', (req, res) => {
  res.send('HASH BACKEND OK');
});

// 🔹 Multer config
const upload = multer({ dest: 'uploads/' });

// 🔹 Función de hash
function generarHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// 🔹 ENDPOINT REAL
app.post('/hash', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image received' });
    }

    const buffer = fs.readFileSync(req.file.path);
    const hash = generarHash(buffer);

    fs.unlinkSync(req.file.path);

    res.json({ hash });
  } catch (error) {
    console.error('Error generando hash:', error);
    res.status(500).json({ error: 'Error generating hash' });
  }
});

// 🔹 Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});
