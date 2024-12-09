const axios = require('axios');

const geminiAI = async (prompt) => {
  // Prepare the payload for the AI model
  const data = JSON.stringify({
    "contents": [
      {
        "parts": [
          {
          //   "text": `User's shop transaction data: \n${transactionData}\n\nUser asked: ${queryText}`
          "text": prompt
          }
        ]
      }
    ]
  });

   // Axios configuration for API request to Gemini model
   const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBs01bjuPm6j5EqPslBtQ13QUkYddhdbS8',
    headers: { 
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
      // Make the API request to Gemini
      const response = await axios.request(config);
        return response.data.candidates[0]?.content?.parts[0]?.text
    } catch (error) {
      console.error("Error fetching AI response:", error);
     return "error" // Return error details
    }
};

module.exports = geminiAI;
