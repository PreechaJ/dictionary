const axios = require('axios');
const line = require('@line/bot-sdk');
const { handler } = require('../index');

jest.mock('axios');
jest.mock('@line/bot-sdk');
const mockReplyMessage = jest.fn();
line.Client.prototype.replyMessage = mockReplyMessage;

describe('Lambda Handler Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should reply with word definitions for valid input', async () => {
    // Mock Dictionary API response
    axios.get.mockResolvedValueOnce({
      data: [
        {
          meanings: [
            {
              partOfSpeech: 'noun',
              definitions: [{ definition: 'A tropical fruit.' }],
            },
            {
              partOfSpeech: 'verb',
              definitions: [{ definition: 'To pickle or preserve fruit.' }],
            },
          ],
        },
      ],
    });

    // Mock Line event
    const event = {
      body: JSON.stringify({
        events: [
          {
            type: 'message',
            message: { type: 'text', text: 'Mango' },
            replyToken: 'test-reply-token',
          },
        ],
      }),
    };

    // Invoke the handler
    const result = await handler(event);

    // Assertions
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.dictionaryapi.dev/api/v2/entries/en/Mango',
    );
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Success');
  });

  test('should reply with error message for word not found', async () => {
    // Mock Dictionary API response for error
    axios.get.mockRejectedValueOnce(new Error('Not Found'));

    // Mock Line event
    const event = {
      body: JSON.stringify({
        events: [
          {
            type: 'message',
            message: { type: 'text', text: 'UnknownWord' },
            replyToken: 'test-reply-token',
          },
        ],
      }),
    };

    // Invoke the handler
    const result = await handler(event);

    // Assertions
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.dictionaryapi.dev/api/v2/entries/en/UnknownWord',
    );
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Success');
  });

  test('should handle invalid event body gracefully', async () => {
    // Invalid event body
    const event = {
      body: JSON.stringify({}),
    };

    // Invoke the handler
    const result = await handler(event);

    // Assertions
    expect(mockReplyMessage).not.toHaveBeenCalled();
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal Server Error');
  });
});
