const { OpenAIApi, Configuration } = require("openai");
const env = require('./.env')
// import dotenv from "dotenv";

// dotenv.config();

// OpenAIApi required config
const configuration = new Configuration({
    apiKey: env.CHATGPT_API_KEY,
});

// OpenAIApi initialization
const openai = new OpenAIApi(configuration);

//These arrays are to maintain the history of the conversation
const conversationContext = [];
const currentMessages = [];


module.exports = {
    async askChatGpt (body) {
        try {
            const { prompt } = body;
            const modelId = "gpt-3.5-turbo";
            const promptText = `${prompt}\n\nResponse:`;
        
            // Restore the previous context
            for (const [inputText, responseText] of conversationContext) {
              currentMessages.push({ role: "user", content: inputText });
              currentMessages.push({ role: "assistant", content: responseText });
            }
        
            // Stores the new message
            currentMessages.push({ role: "user", content: promptText });
        
            const result = await openai.createChatCompletion({
              model: modelId,
              messages: currentMessages,
            });
        
            const responseText = result.data.choices.shift().message.content;
            conversationContext.push([promptText, responseText]);
            return { response: responseText, error: null };
          } catch (err) {
            console.error(err);
            return { response: null, error: err };
          }
    }
}