import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import Communication from '../models/Communication'; // Import Communication model
import PdfDocument from '../models/PdfDocument';     // Import PdfDocument model
import connectDB from '../config/db';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany(); // Clear existing users
    await Communication.deleteMany(); // Clear existing communications
    await PdfDocument.deleteMany();   // Clear existing PDF documents

    const adminUser = await User.create({
      username: 'admin',
      password: 'admin123', // Mongoose pre-save hook will hash this
      role: 'admin',
    });

    console.log('Admin user created!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Communication.deleteMany(); // Delete communications
    await PdfDocument.deleteMany();   // Delete PDF documents
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
