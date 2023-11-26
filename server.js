const PORT=5000
const express = require('express')
const cors = require('cors')
require('dotenv').config();

const app = express()
// allows us to work with json while sending stuff from frontend to backend without POST request
app.use(express.json())
app.use(cors())
const {PromptTemplate} = require("langchain/prompts")
const {ChatOpenAI} = require("langchain/chat_models/openai")
const { SequentialChain, LLMChain, ConversationChain } = require("langchain/chains");
const { BufferWindowMemory } = require("langchain/memory");
const { RunnableSequence } = require("langchain/schema/runnable");
const { StringOutputParser } = require("langchain/schema/output_parser");
const { OpenAI } = require("langchain/llms/openai");


// will create a .sth file to keep it more safe
const API_KEY = process.env.OPENAI_API_KEY

const memory = new BufferWindowMemory({k:2,inputKey:"text"})

app.post('/chat',async (req, res)=>{
    try{
      const inputs = req.body;
      
      
      const llm = new OpenAI({
        openAIApiKey: API_KEY,
        modelName:"gpt-3.5-turbo",
        maxTokens: 150,
      });
      template = `Roleplay the scenario: {setting}
      
      Human: {text}
      Reply: This is a reply for the above sentence:`;

      
      const replyTemplate = new PromptTemplate({
        template,
        inputVariables: ["text","setting"],
      });
      const replyChain = new ConversationChain({
        llm,
        prompt: replyTemplate,
        outputKey: "reply",
        memory: memory
      });
      
      
      const suggestionLLM = new OpenAI({
        openAIApiKey: API_KEY,
        modelName:"gpt-3.5-turbo",
        maxTokens: 150,
      });
      
      const suggestionTemplate = `Give 2 prompts to continue the conversation. Mention just the prompts, in points.
      Conversation:
      {reply}`

      const suggestionPromptTemplate = new PromptTemplate({
        template: suggestionTemplate,
        inputVariables: ["reply"],
      });

      const suggestionChain = new LLMChain({
        llm: suggestionLLM,
        prompt: suggestionPromptTemplate,
        outputKey: "suggestion",
      });

      const overallChain = new SequentialChain({
        chains: [replyChain, suggestionChain],
        inputVariables: ["text","setting"],
        // Here we return multiple variables
        outputVariables: ["reply", "suggestion"],
        verbose: true,
      });
      
      const chainExecutionResult = await overallChain.call(inputs);
      console.log(chainExecutionResult);
      
      
      
      const model = new ChatOpenAI({
        openAIApiKey: API_KEY,
        modelName:"gpt-3.5-turbo",
        maxTokens: 100,
      });
      
      // const promptTemplate = PromptTemplate.fromTemplate(`Return NULL or give the correct sentence if there are any mistakes in the following sentence:{text}. If there are no mistakes, return NULL`);
      const promptTemplate = PromptTemplate.fromTemplate(`Return NULL or return the correct sentence for following sentence, if there are any mistakes in it:{text}. If there are no mistakes, return NULL`);
      
      const outputParser = new StringOutputParser();
      const chain = RunnableSequence.from([promptTemplate, model, outputParser]);
      const result = await chain.invoke(inputs);
      console.log(result);    

      res.send([chainExecutionResult,result])
    
    }
    catch(error){
        console.error(error)
    }
})




/*
const works_with_memory = async()=>{

  const inputs = {
    text: "I'm goood how' about u."
  }
  // const inputs = req.body;
    
    
  const llm = new OpenAI({
    openAIApiKey: API_KEY,
    modelName:"gpt-3.5-turbo",
    maxTokens: 100,
  });
  template = `Continue the casual conversation, as a human, and not as an ai bot.
  
  Human: {text}
  Ai: This is a reply for the above sentence:`;

  
  const replyTemplate = new PromptTemplate({
    template,
    inputVariables: ["text"],
  });
  const replyChain = new ConversationChain({
    llm,
    prompt: replyTemplate,
    outputKey: "reply",
    memory: memory
  });
  
  
  const suggestionLLM = new OpenAI({
    openAIApiKey: API_KEY,
    modelName:"gpt-3.5-turbo",
    maxTokens: 150,
  });
  
  const suggestionTemplate = `Give 2 prompts to continue the conversation. Mention just the prompts, in points.
  Conversation:
  {reply}`

  const suggestionPromptTemplate = new PromptTemplate({
    template: suggestionTemplate,
    inputVariables: ["reply"],
  });

  const suggestionChain = new LLMChain({
    llm: suggestionLLM,
    prompt: suggestionPromptTemplate,
    outputKey: "suggestion",
  });

  const overallChain = new SequentialChain({
    chains: [replyChain, suggestionChain],
    inputVariables: ["text"],
    // Here we return multiple variables
    outputVariables: ["reply", "suggestion"],
    verbose: true,
  });
  
  const chainExecutionResult = await overallChain.call(inputs);
  console.log(chainExecutionResult);
  
  
  
  const model = new ChatOpenAI({
    openAIApiKey: API_KEY,
    modelName:"gpt-3.5-turbo",
    maxTokens: 100,
  });
  
  const promptTemplate = PromptTemplate.fromTemplate(`Return NULL or give the correct sentence for following sentence, if there are any mistakes in it:{text}. If there are no mistakes, return NULL`);
  const outputParser = new StringOutputParser();
  const chain = RunnableSequence.from([promptTemplate, model, outputParser]);
  const result = await chain.invoke(inputs);
  console.log(result);     
  
  // console.log(memory);
}







const BEST = async()=>{
  const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName:"gpt-3.5-turbo",
    maxTokens: 100,
  });
  template = `Continue the casual conversation, as a human, and not as an ai bot.
  
  Human: {text}
  Ai: This is a reply for the above sentence:`;

  const replyTemplate = new PromptTemplate({
    template,
    inputVariables: ["text"],
  });
  const replyChain = new LLMChain({
    llm,
    prompt: replyTemplate,
    outputKey: "reply",
  });


  const suggestionLLM = new OpenAI({
    openAIApiKey: API_KEY,
    modelName:"gpt-3.5-turbo",
    maxTokens: 150,
  });

  const suggestionTemplate = `Give 2 prompts to continue the conversation. Mention just the prompts, in points.
  Conversation:
  {reply}`

  const suggestionPromptTemplate = new PromptTemplate({
    template: suggestionTemplate,
    inputVariables: ["reply"],
  });

  const suggestionChain = new LLMChain({
    llm: llm,
    prompt: suggestionPromptTemplate,
    outputKey: "suggestion",
  });

  const overallChain = new SequentialChain({
    chains: [replyChain, suggestionChain],
    inputVariables: ["text"],
    // Here we return multiple variables
    outputVariables: ["reply", "suggestion"],
    verbose: true,
  });

  const chainExecutionResult = await overallChain.call({
    text: "Wha is your name?",
    // era: "Victorian England",
  });
  console.log(chainExecutionResult);



  const model = new ChatOpenAI({
    openAIApiKey: API_KEY,
    modelName:"gpt-3.5-turbo",
    maxTokens: 100,
  });
  
  const promptTemplate = PromptTemplate.fromTemplate(`Give the correct sentence if there are any mistakes in the following sentence:{text}`);
  
  const chain = promptTemplate.pipe(model);
  const result = await chain.invoke({ text: "Wh is your name?" });
  console.log(result);
}



const works = async()=>{
  const model = new ChatOpenAI({
      openAIApiKey: API_KEY,
      modelName:"gpt-3.5-turbo",
      maxTokens: 100,
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", "Hold a casual conversation, as not an ai bot, but as a human."],
      ["human", "Mention any grammatical, spelling or sentence construction errors made as well, if any"],
      ["human", "Tip: Follow the instructions properly"],
      // ["human", "so hwo's was ur day"],
      // ["ai", "It has been such an amazing day! I just got a game today that I've been wanting for ages! What about you? How has your day been?\n\n(Correction: So, how was your day?)"],
      ["human", "{text}"]
    ]);

  const chain = promptTemplate.pipe(model);

  const result = await chain.invoke({ text: "Wh is your name?" });

  console.log(result);
 
}
*/
// works_with_memory();

app.listen(PORT, () => console.log('server running on port '+PORT))