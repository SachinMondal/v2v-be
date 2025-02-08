# Backend - Video Transformation API

## Overview

This is the **backend** of the Video Transformation App, built with **Node.js** and **Express.js**. It handles video processing, storage, and API communication with external services like **Uploadcare** and **Cloudinary**.

## Features

- Accepts video uploads from **Uploadcare**
- Processes lip-sync transformations via AI models
- Stores processed videos in **Cloudinary**
- Provides API endpoints for frontend integration
- Implements authentication for secure access

## Tech Stack

- **Node.js** (Runtime)
- **Express.js** (Web framework)
- **Uploadcare API** (File hosting)
- **Cloudinary API** (Video storage)
- **MongoDB** (Database)

## Installation & Setup

### 1. Clone the repository:

```sh
git clone https://github.com/SachinMondal/v2v-be.git
cd backend
```

### 2. Install dependencies:

```sh
yarn install  # or npm install
```

### 3. Set up environment variables:

Create a `.env` file and add the following:

```env
MONGO_URI=your_mongodb_connection_string
UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key
UPLOADCARE_SECRET_KEY=your_uploadcare_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Start the development server:

```sh
yarn dev  # or npm run dev
```

## API Endpoints

### 1. Upload Video

`POST /api/upload`

- **Body:** `{ file: videoFile }`
- **Response:** `{ fileUrl: "uploaded_file_url" }`

### 2. Transform Video

`POST /api/transform`

- **Body:** `{ videoUrl: "url", audioUrl: "url", syncMode: "cut-off" }`
- **Response:** `{ transformedUrl: "output_video_url" }`

### 3. Get Processed Videos

`GET /api/videos`

- **Response:** `[{ id, originalUrl, transformedUrl }]`

## Folder Structure

```
backend/
│── src/
│   ├── controllers/    # API logic
│   ├── models/         # Database models (MongoDB)
│   ├── routes/         # Express routes
│   ├── utils/          # Helper functions
│── .env                # Environment variables
│── server.js           # Main entry point
│── package.json        # Project dependencies
│── README.md           # Project documentation
```


## Contribution

Feel free to submit issues and pull requests to improve the project.

## License

MIT License

