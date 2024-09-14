import express from 'express';
import cors from 'cors';
import { PORT, allowedOrigins } from './config/config.js'; // Importar allowedOrigins
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
