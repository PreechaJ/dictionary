const axios = require('axios');
const line = require('@line/bot-sdk');

// Dictionary API endpoint
const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// Line API credentials (use environment variables in Lambda for security)
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

// Initialize Line Client
const client = new line.Client({
  channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: LINE_CHANNEL_SECRET,
});

// Function to fetch word definitions from Dictionary API
const fetchDefinition = async (word) => {
  try {
    const response = await axios.get(`${DICTIONARY_API_URL}${word}`);
    const meanings = response.data[0].meanings;
    console.log('meanings', JSON.stringify(meanings));

    let result = '';
    meanings.forEach((meaning) => {
      const partOfSpeech = meaning.partOfSpeech;
      const definition = meaning.definitions[0].definition; // Get the first definition
      result += `${partOfSpeech.charAt(0).toUpperCase() + partOfSpeech.slice(1)}: ${definition}\n`;
    });

    return result.trim();
  } catch {
    return "Sorry, I couldn't find a definition for that word.";
  }
};

// Lambda Handler Function
exports.handler = async (event) => {
  try {
    // Parse the incoming event from Line
    console.log('event', JSON.stringify(event));
    const body = JSON.parse(event.body);
    const events = body.events;

    // Process each event
    const promises = events.map(async (lineEvent) => {
      if (lineEvent.type === 'message' && lineEvent.message.type === 'text') {
        const userMessage = lineEvent.message.text; // User's word input
        const replyToken = lineEvent.replyToken;

        // Fetch word definition
        const definition = await fetchDefinition(userMessage);

        // Reply to the user
        await client.replyMessage(replyToken, {
          type: 'text',
          text: definition,
        });
      }
    });

    // Wait for all events to process
    await Promise.all(promises);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch (error) {
    console.error('Error processing event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
