# Secure Image Upload with Vercel and Cloudinary

This project demonstrates a secure image upload workflow using Vercel serverless functions and Cloudinary for media handling. The application allows users to upload images securely, store the image URLs in MongoDB Atlas, and display the uploaded images.

## Features

- Secure client-side image upload using Cloudinary
- Server-side signature generation for secure uploads
- MongoDB Atlas integration for storing image metadata
- Responsive image gallery to display uploaded images
- Modern UI with responsive design

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Vercel Account](https://vercel.com/) connected to GitHub
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- [Cloudinary Account](https://cloudinary.com/) (free tier is sufficient)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Environment Variables in Vercel

Make sure to add the following environment variables in your Vercel project settings:

- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `MONGODB_URI`: Your MongoDB connection string

## Project Structure

- `/pages`: Next.js pages
  - `/api`: API routes for serverless functions
    - `upload-signature.js`: Generates secure signatures for Cloudinary uploads
    - `save-image-url.js`: Saves uploaded image URLs to MongoDB
    - `get-images.js`: Retrieves uploaded images from MongoDB
  - `index.js`: Main application page with upload form and image gallery
- `/styles`: CSS styles
  - `globals.css`: Global styles
  - `Home.module.css`: Component-specific styles

## Security Considerations

- API secrets are stored as environment variables and never exposed to the client
- Upload signatures are generated server-side to prevent unauthorized uploads
- MongoDB connection is secured with proper authentication

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Cloudinary](https://cloudinary.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel](https://vercel.com/)
