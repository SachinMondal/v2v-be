import cloudinary from 'cloudinary';
import Video from '../models/Video.js';
import { fal } from '@fal-ai/client';
import dotenv from 'dotenv';
dotenv.config();
fal.config({api_key: process.env.FAL_KEY});
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadVideo = async (req, res) => {
  console.log(req.files);
  try {
    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }
    const videoFile = req.files.video;
    const uploadResponse = await cloudinary.v2.uploader.upload(videoFile.tempFilePath, { resource_type: 'video' });
    const newVideo = new Video({ sourceUrl: uploadResponse.secure_url });
    await newVideo.save();
    res.json({ message: 'Video uploaded successfully', video: uploadResponse.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

export const transformVideo = async (req, res) => {
  try {
    const { videoUrl, parameters } = req.body;
console.log(req.body);
    const result = await fal.subscribe("fal-ai/sync-lipsync", {
      input: {
        video_url: videoUrl,
        ...parameters
      },
      logs: true,
      
      onQueueUpdate: (update) => {
        console.log("Queue Update:", update.status);
        if (update.status === "IN_PROGRESS") {
          update.logs?.forEach(log => console.log(log.message));
        }
        if (update.status === "COMPLETED") {
          console.log("Transformation Complete:", update.output);
        }
      },
    });

    res.json({ message: "Transformation started", requestId: result.requestId, data: result.data });
  } catch (error) {
    console.error("Error in transformVideo:", error.message);
    res.status(500).json({ message: "Transformation failed", error: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const { transformedVideoUrl, sourceVideoUrl } = req.body;
    if (!transformedVideoUrl || !sourceVideoUrl) {
      return res.status(400).json({ message: "Missing video URLs in webhook data" });
    }

    console.log("Received transformed video:", transformedVideoUrl);

    // Upload transformed video to Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(transformedVideoUrl, {
      resource_type: "video",
      folder: "transformed_videos",
    });

    console.log("Uploaded to Cloudinary:", cloudinaryResponse.secure_url);

    // Update database with new video URL
    const updatedVideo = await Video.findOneAndUpdate(
      { sourceUrl: sourceVideoUrl },
      { transformedUrl: cloudinaryResponse.secure_url },
      { new: true }
    );

    res.json({ message: "Webhook received and processed", updatedVideo });
  } catch (error) {
    console.error("Webhook Handling Error:", error.message);
    res.status(500).json({ message: "Webhook handling failed", error: error.message });
  }
}

export const getHistory = async (req, res) => {
  try {
    const history = await Video.find();
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};