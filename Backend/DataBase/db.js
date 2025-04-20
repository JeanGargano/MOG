import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error("❌ Error: MONGODB_URI no está definido en el archivo .env");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

export default connectDB;
