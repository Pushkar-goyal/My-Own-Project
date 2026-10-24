/**
 * OCR Ready Architecture Service Stub
 * 
 * Prepares standard parsing interface for Tesseract.js, Google Cloud Vision API,
 * or AWS Textract integrations to extract structured demographic data directly
 * from uploaded Aadhaar, PAN, Voter ID, and Passport documents.
 */

export const ocrService = {
  /**
   * Simulates OCR extraction for uploaded documents.
   * Can be connected to a real WebWorker / WASM Tesseract build in future.
   */
  async extractFieldsFromDocument(file, documentType) {
    console.log(`[OCR Engine] Analyzing document "${file.name}" of type "${documentType}"...`);

    // Simulated parsing delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockExtracted = {
      fullName: "Pushkar Goel",
      dob: "1994-08-15",
      gender: "Male",
      aadhaarNumber: "4589 1234 9012",
      panNumber: "ABCDE1234F",
      street: "Sector 14, MG Road",
      city: "Gurugram",
      state: "Haryana",
      pinCode: "122001"
    };

    return {
      documentType,
      extractedFields: mockExtracted,
      confidenceScore: 0.96
    };
  }
};
