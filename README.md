# **Line Bot with AWS Lambda and Dictionary API**

This is a serverless **Line Bot** deployed using **AWS Lambda**, which fetches word definitions from the **DictionaryAPI** and replies to users on Line. The bot is built using **Node.js** and **AWS Free Tier** services to ensure zero cost while staying within the free usage limits.

### **Features**

- Accepts a word as input from the user.
- Fetches the word's definition and part of speech using the **DictionaryAPI**.
- Responds with the definition in a structured format on the **Line Chat**.
- Uses **AWS Lambda** to host the function, **API Gateway** to expose the webhook endpoint, and **Line Messaging API** to interact with users.

---

### **Tech Stack**

- **Node.js**: JavaScript runtime environment.
- **AWS Lambda**: Serverless computing platform to run the bot logic.
- **DictionaryAPI**: Provides definitions and synonyms for words.
- **Line Messaging API**: Platform to interact with users on Line.

---

### **Architecture**

1. **User Input**: The user sends a word via Line Chat.
2. **Webhook**: Line sends the message to the **Function URL** endpoint.
3. **Lambda Function**: The request is processed by an AWS Lambda function, which fetches the word definition from **DictionaryAPI**.
4. **Response**: Lambda replies to the user with the word’s definition on Line.

---

### **Prerequisites**

1. **AWS Account**: You need an AWS account to deploy the Lambda.
2. **Line Developer Account**: Set up a Line Developer account to create a bot.
3. **Node.js v18+**: Ensure that Node.js is installed on your local machine to run the code.
4. **DictionaryAPI**: Use [DictionaryAPI](https://dictionaryapi.dev/) for fetching word definitions.

   Assume you have all aws lambda setup, and line message api webhook configuration.
---

### **Installation & Deployment**

#### **Step 1: Clone the Repository**

```bash
git clone <repository-url>
cd <repository-name>
```
#### **Step 2: Install Dependencies**
Make sure Node.js is installed, then run the following to install dependencies:

```bash
npm install
```

#### **Step 3: Set Environment Variables**
Create a .env file or set the following environment variables in AWS Lambda:
```text
LINE_CHANNEL_ACCESS_TOKEN - Your Line bot access token.
LINE_CHANNEL_SECRET - Your Line bot secret.
```
#### **Step 4: Deploy to AWS Lambda**
Package the Project:

Zip your project files (including node_modules).
```bash
npm run package
```
Assume you have created aws lambda name "dictionary", and have proper aws config in local
```bash
npm run deploy
```

#### **Step 6: Test the Bot**

Add Line account @556hpbkp
Send a word (e.g., "Mango") to your Line bot. It should respond with the word's definition and part of speech.

![Alt text](line.png)
