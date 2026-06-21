require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

// Import Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const supervisorRoutes = require('./routes/supervisor');
const adminRoutes = require('./routes/admin');

const server = express();
// Ubah default port ke 5000 atau 8000 agar tidak bentrok dengan frontend Next.js yang biasanya pakai 3000
const PORT = process.env.PORT || 5000; 

// Middleware
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// API Routes
server.use('/api/auth', authRoutes);
server.use('/api/student', studentRoutes);
server.use('/api/teacher', teacherRoutes);
server.use('/api/supervisor', supervisorRoutes);
server.use('/api/admin', adminRoutes);

// Endpoint dasar untuk memastikan server berjalan
server.get('/', (req, res) => {
  res.json({ message: 'API Backend PKL Monitoring Berjalan dengan Baik!' });
});

// Sync Database dan Jalankan Server
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Automatically sync database models in development mode
    if (process.env.NODE_ENV !== 'production') {
      
      // ⚠️ TEMPORARY FIX: We are using { force: true } to drop corrupted tables and rebuild them
      await db.sequelize.sync({ alter: true });
      console.log('Database synchronized (FORCED REBUILD).');
      
    }

    server.listen(PORT, () => {
      console.log(`> Server ready on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();