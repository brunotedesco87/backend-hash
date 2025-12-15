import express from 'express';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';
import { imageHash } from 'image-hash';

const app = express(); // ✅ PRIMERO se inicializa app

app.use(cors());
app.use(express.json());

// 🔹 ENDPOINT DE PRUEBA (AHORA SÍ está bien ubicado)
app.get('/', (req, res) => {
  res.send('HASH BACKEND OK');
});

// 🔹 Multer config
const upload = multer({ dest: 'uploads/' });

// 🔹 ENDPOINT REAL
app.post('/hash', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image received' });
    }

    imageHash(req.file.path, 16, true, (error, hash) => {
      fs.unlinkSync(req.file.path);

      if (error) {
        console.error("Error generando pHash:", error);
        return res.status(500).json({ error: "Error generating pHash" });
      }

      // hash es un string binario perceptual
      res.json({ hash });
    });

  } catch (error) {
    console.error('Error generando hash:', error);
    res.status(500).json({ error: 'Error generating hash' });
  }
});

// 🔹 Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});
