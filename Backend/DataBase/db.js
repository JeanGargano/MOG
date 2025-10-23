// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error("Error: MONGODB_URI is not defined in the .env file");
    process.exit(1);
}

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * If the connection is successful, a confirmation message is logged.
 * If it fails, the error is printed and the application is terminated.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

export default connectDB;
