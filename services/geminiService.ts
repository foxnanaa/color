import { GoogleGenAI } from "@google/genai";

const AI_MODEL = 'gemini-2.5-flash-image';

// Helper to load image for dimension extraction and resizing
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image data"));
    img.src = src;
  });
};

export const processImage = async (
  base64Image: string,
  selectedColors: string[],
  intensity: number
): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing. Please check your environment configuration.");
    }

    // 1. Capture original dimensions
    const originalImg = await loadImage(base64Image);
    const targetWidth = originalImg.width;
    const targetHeight = originalImg.height;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct a specific prompt for the crystal colorization task
    const colorsString = selectedColors.join(" and ");
    const densityText = intensity > 0.5 ? "many" : "some";
    
    const prompt = `
      Act as a scientific image enhancement expert. 
      I am providing an SEM (Scanning Electron Microscope) micrograph of crystals.
      
      Task:
      1. Identify individual crystals in the image.
      2. Randomly select ${densityText} distinct crystals (approx ${Math.floor(intensity * 100)}% coverage) to form a region of interest.
      3. Colorize these selected crystals using vivid ${colorsString} colors.
      4. Keep the unselected crystals and the background in their original grayscale/black and white.
      5. Ensure the coloring strictly respects the edges of the crystals and looks naturally integrated into the texture.
      6. Do NOT add any visible watermarks, text overlays, or labels.
      7. Maintain the original composition and perspective exactly.
      8. Return ONLY the processed image.
    `;

    // Remove data URL prefix for the API
    const base64Data = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming generic support, API handles png/jpeg
              data: base64Data
            }
          }
        ]
      }
    });

    // Extract the image from the response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No response candidates received from Gemini.");
    }

    const parts = candidates[0].content?.parts;
    if (!parts) {
      throw new Error("No content parts in response.");
    }

    // Look for the image part
    let resultBase64 = null;
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        resultBase64 = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!resultBase64) {
      // Fallback if no image found
      if (parts[0].text) {
        console.warn("Model returned text instead of image:", parts[0].text);
        throw new Error("The model returned text instead of an image. Try adjusting the input.");
      }
      throw new Error("No valid image data found in the response.");
    }

    // 2. Resize the result to match the original dimensions exactly
    const generatedImg = await loadImage(resultBase64);
    
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error("Canvas context not available");
    }

    // Draw the generated image onto the canvas with original dimensions
    ctx.drawImage(generatedImg, 0, 0, targetWidth, targetHeight);

    return canvas.toDataURL('image/png');

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to process image with Gemini AI.");
  }
};
