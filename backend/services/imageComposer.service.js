/**
 * This service is deprecated Only use for editing the generated raw image
 * directly from backend using sharp we use this to explicitly
 * create a logo in the raw image
 * (causes performance issues)
 * bad practice
 * user should be able to edit the image in UI only
 */
import sharp from "sharp";

export const addUserWatermark = async (imageBuffer, userName) => {
  const firstName = userName.split(" ")[0];

  // Create SVG watermark
  const svg = `
    <svg width="500" height="200">
      <style>
        .title {
          fill: white;
          font-size: 48px;
          font-family: Arial, sans-serif;
          opacity: 0.25;
        }
      </style>
      <text x="100%" y="100%" text-anchor="end" class="title" dx="-20" dy="-20">
        ${firstName}
      </text>
    </svg>
  `;

  const watermarkBuffer = Buffer.from(svg);

  const finalImage = await sharp(imageBuffer)
    .composite([
      {
        input: watermarkBuffer,
        gravity: "southeast" // bottom-right
      }
    ])
    .png()
    .toBuffer();

  return finalImage;
};