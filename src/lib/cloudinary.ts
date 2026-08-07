/**
 * Utility functions for Cloudinary transformations
 */

export function getWatermarkedUrl(originalUrl: string | null | undefined): string {
  if (!originalUrl) return "";
  
  // Only apply to Cloudinary URLs that have the standard /upload/ path
  if (originalUrl.includes("res.cloudinary.com") && originalUrl.includes("/upload/")) {
    // Watermark configuration using TEXT so it works instantly without needing to upload a logo:
    // l_text:Arial_60_bold:Al-Arz Investments : Render text
    // co_white      : Color white
    // g_south_east  : Position at Bottom Right
    // o_70          : Set opacity to 70%
    // x_20, y_20    : 20px padding from the edges
    const watermarkTransform = "l_text:Arial_60_bold:Al-Arz,co_white,g_south_east,o_70,x_20,y_20";
    
    // Inject the transformation directly after /upload/
    return originalUrl.replace("/upload/", `/upload/${watermarkTransform}/`);
  }
  
  // Return original if it's not a standard Cloudinary URL (e.g. Unsplash)
  return originalUrl;
}
