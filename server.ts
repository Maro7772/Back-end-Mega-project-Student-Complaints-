import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;



const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

