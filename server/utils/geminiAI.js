const { GoogleGenerativeAI } = require("@google/generative-ai");

const gemini_api_key = "AIzaSyBs01bjuPm6j5EqPslBtQ13QUkYddhdbS8";
const googleAI = new GoogleGenerativeAI(gemini_api_key);
// const geminiConfig = {
//   temperature: 0.9,
//   topP: 1,
//   topK: 1,
//   maxOutputTokens: 4096,
// };
 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  // geminiConfig,
});
 
const geminiAI = async (prompt) => {
  try {
       const result = await geminiModel.generateContent(prompt);

    // Handle the response
    const response = result?.response?.text();
    if (!response) {
      throw new Error("Unexpected response format");
    }
    return response;
  } catch (error) {
    console.error("Error in geminiAI:", error.message);
    throw error;
  }
};

 
module.exports = geminiAI;