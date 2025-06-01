import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);

  // Fetch previously uploaded images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('/api/get-images');
      setUploadedImages(response.data.images || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadMessage('');
      setImageUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setUploadMessage('Please select an image file.');
      return;
    }

    setIsUploading(true);
    setUploadMessage('Uploading...');

    try {
      // 1. Get the upload signature from our API
      const signatureResponse = await axios.get('/api/upload-signature');
      const { signature, timestamp, cloudName, apiKey } = signatureResponse.data;

      // 2. Prepare form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      
      // 3. Upload to Cloudinary
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      if (cloudinaryResponse.data && cloudinaryResponse.data.secure_url) {
        setUploadMessage('Image uploaded successfully!');
        setImageUrl(cloudinaryResponse.data.secure_url);
        
        // 4. Save the image URL to our database
        await saveImageUrlToDatabase(cloudinaryResponse.data.secure_url);
        
        // 5. Refresh the image list
        await fetchImages();
        
        // 6. Reset the file input
        setFile(null);
        document.getElementById('imageInput').value = '';
      } else {
        setUploadMessage('Image upload failed.');
        console.error('Cloudinary upload error:', cloudinaryResponse.data);
      }
    } catch (error) {
      setUploadMessage('An error occurred during upload.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const saveImageUrlToDatabase = async (imageUrl) => {
    try {
      const response = await axios.post('/api/save-image-url', {
        url: imageUrl
      });
      console.log('Save image URL response:', response.data);
    } catch (error) {
      console.error('Error saving image URL:', error);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Secure Image Upload with Cloudinary
        </h1>
        
        <div className={styles.uploadSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="imageInput">Choose an image:</label>
              <input 
                type="file" 
                id="imageInput" 
                name="image" 
                accept="image/*" 
                onChange={handleFileChange}
                required 
                className={styles.fileInput}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isUploading || !file} 
              className={styles.button}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            
            {uploadMessage && (
              <div className={styles.message}>
                {uploadMessage}
              </div>
            )}
            
            {imageUrl && (
              <div className={styles.preview}>
                <p>Uploaded Image URL:</p>
                <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                  {imageUrl}
                </a>
                <img 
                  src={imageUrl} 
                  alt="Uploaded preview" 
                  className={styles.previewImage} 
                />
              </div>
            )}
          </form>
        </div>
        
        <div className={styles.gallery}>
          <h2>Recently Uploaded Images</h2>
          {uploadedImages.length > 0 ? (
            <div className={styles.imagesGrid}>
              {uploadedImages.map((image, index) => (
                <div key={index} className={styles.imageCard}>
                  <img 
                    src={image.url} 
                    alt={`Uploaded image ${index + 1}`} 
                    className={styles.galleryImage} 
                  />
                  <p className={styles.uploadDate}>
                    {new Date(image.uploadedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No images uploaded yet.</p>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Cloud Computing Lab 12 - Vercel + Cloudinary for Secure Image Uploads</p>
      </footer>
    </div>
  );
}
