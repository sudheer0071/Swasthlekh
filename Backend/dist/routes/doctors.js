"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route1 = void 0;
const express_1 = __importDefault(require("express"));
const zodAuth_1 = require("../zodAuth");
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const openai_1 = require("@langchain/openai");
const combine_documents_1 = require("langchain/chains/combine_documents");
const prompts_1 = require("@langchain/core/prompts");
const text_splitter_1 = require("langchain/text_splitter");
const openai_2 = require("@langchain/openai");
const memory_1 = require("langchain/vectorstores/memory");
const retrieval_1 = require("langchain/chains/retrieval");
const history_aware_retriever_1 = require("langchain/chains/history_aware_retriever");
const prompts_2 = require("@langchain/core/prompts");
const messages_1 = require("@langchain/core/messages");
const documents_1 = require("@langchain/core/documents");
// Import environment variables
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const storage_1 = require("@google-cloud/storage");
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './winter-flare-414016-a7dd7ec7508f.json';
const storageClient = new storage_1.Storage();
const bucketname = 'swasthlekh_bucket';
const jwt = require('jsonwebtoken');
const route1 = express_1.default.Router();
exports.route1 = route1;
const prisma = new client_1.PrismaClient();
const secret = '1234hjkl';
route1.get('/doc', (req, res) => {
    res.send('yoo backend is running in doctor.ts');
});
route1.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstname, lastname } = req.body;
    const zodVerfify = zodAuth_1.signUpSchema.safeParse(req.body);
    const alreadyExist = yield prisma.doctor.findUnique({
        where: { username }
    });
    if (!zodVerfify.success) {
        console.log(zodVerfify);
        return res.json({ message: "make sure to add correct email" });
    }
    if (alreadyExist) {
        return res.json({ message: "username already exist , try something unique" });
    }
    const user = yield prisma.doctor.create({
        data: { username, password, firstname, lastname }
    });
    const token = jwt.sign({ userId: user.id }, secret);
    res.json({ message: "User created successfully", token: token });
}));
route1.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const zodVerfify = zodAuth_1.signinSchema.safeParse(req.body);
    const exist = yield prisma.doctor.findUnique({
        where: { username }
    });
    const user = yield prisma.doctor.findUnique({
        where: { username, password }
    });
    if (!zodVerfify.success) {
        console.log(zodVerfify);
        return res.json({ message: "make sure to add correct email" });
    }
    if (!exist) {
        return res.json({ message: "User doesn't exist" });
    }
    if (!user) {
        return res.json({ message: "Invalid Credentials" });
    }
    console.log(exist);
    const token = jwt.sign({ userId: user.id }, secret);
    res.json({ message: "Fetching details...", token: token, firstname: user.firstname });
}));
route1.post('/reports', middleware_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        console.log("patients id: " + username.username);
        const response = yield prisma.user.findUnique({
            where: { username },
            include: {
                files: {
                    select: {
                        filename: true,
                        data: true,
                        date: true
                    }
                }
            }
        });
        if (response == null) {
            return res.json({ message: 'user with username: "' + username + '" does not exist' });
        }
        if (response.files.length == 0) {
            return res.json({ message: "No resports associated with username: " + username });
        }
        console.log(response);
        const files = response.files.map((file) => ({
            filename: file.filename,
            date: new Date(file.date).toString() // Assuming file.date is a Date object
        }));
        res.json({ message: "showing reports", files: files });
    }
    catch (error) {
        res.json({ message: "No resports associated with username: " + req.body });
    }
}));
route1.post('/pdf', middleware_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, username, actions } = req.body;
    console.log("userid: " + req.userId);
    console.log("username: " + username);
    const user = yield prisma.user.findUnique({
        where: { username },
        include: {
            files: {
                select: {
                    filename: true,
                    data: true
                }
            }
        }
    });
    if (!user) {
        return res.json({ message: "User not found" });
    }
    const downloadPath = 'src\\downloads';
    if (!fs_1.default.existsSync(downloadPath)) {
        fs_1.default.mkdirSync(downloadPath, { recursive: true });
    }
    const file = user.files.find((file) => file.filename === filename);
    if (!file) {
        return res.json({ message: "File doesn't exist in database" });
    }
    else {
        const filePath = path_1.default.join(downloadPath, filename);
        fs_1.default.writeFileSync(filePath, Buffer.from(file.data));
        // Read the file from disk
        const stream = fs_1.default.createReadStream(filePath);
        const stat = fs_1.default.statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        const readableStream = new stream_1.Readable({
            read() { }
        });
        // Pipe the file contents to the response
        stream.on('data', (chunk) => {
            readableStream.push(chunk);
        });
        stream.on('end', () => {
            readableStream.push(null);
        });
        readableStream.pipe(res);
    }
    console.log("file viewd ...");
    console.log("giving file...");
    const doc = yield prisma.doctor.findUnique({
        where: { id: req.userId }
    });
    console.log("docName: " + doc.username);
    const alreadyExist = yield prisma.logs.findUnique({
        where: {
            combinedLogs: {
                doctorEmail: doc.username,
                userEmail: username
            }
        }
    });
    console.log("already Created: " + alreadyExist);
    if (alreadyExist) {
        const logs = yield prisma.logs.upsert({
            create: {
                userEmail: username,
                doctorEmail: req.userId,
                accessedFiles: {
                    create: {
                        actions,
                        date: new Date(),
                        filename
                    },
                },
            },
            update: {
                accessedFiles: {
                    create: {
                        actions,
                        date: new Date(),
                        filename
                    },
                },
            },
            where: {
                combinedLogs: {
                    userEmail: username,
                    doctorEmail: doc.username
                }
            }
        });
    }
    else {
        try {
            const newLog = yield prisma.logs.create({
                data: {
                    userEmail: username,
                    doctorEmail: doc.username,
                    accessedFiles: {
                        create: {
                            actions: actions,
                            date: new Date(),
                            filename
                        },
                    },
                },
            });
            console.log("new log: " + newLog);
        }
        catch (error) {
            console.log(error);
        }
    }
    // console.log("createing log... "+ logs);
}));
route1.post('/access', middleware_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    const doc = yield prisma.doctor.findUnique({
        where: { id: req.userId }
    });
    const access = yield prisma.accessReport.create({
        data: {
            user: username,
            doctor: doc.username,
            date: new Date()
        }
    });
    res.json({ message: "creating access", access: access });
}));
function listFilesByPrefix(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const storage = new storage_1.Storage();
        var data = '';
        console.log("inside listFliesbyPrefix: ");
        const delimiter = '/';
        const options = {
            prefix: prefix,
        };
        console.log("prefix: " + prefix);
        if (delimiter) {
            options.delimiter = delimiter;
        }
        // Lists files in the bucket, filtered by a prefix
        const [files] = yield storage.bucket('swasthlekh_bucket').getFiles(options);
        console.log("Files: " + files);
        const promises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
            // Downloads the file into a buffer in memory.
            const contents = yield storage.bucket('swasthlekh_bucket').file(`${file.name}`).download();
            const jstring = JSON.parse(contents.toString());
            const pgnumber = jstring.responses.length;
            for (let i = 0; i < pgnumber; i++) {
                const PageResponse = jstring.responses[i];
                const annotation = PageResponse.fullTextAnnotation;
                // console.log("annotations: "+annotation.text); 
                data += annotation.text;
            }
        }));
        yield Promise.all(promises);
        return data;
    });
}
route1.post('/chat', middleware_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, userFile, input } = req.body;
    // const user = await prisma.user.findUnique({
    //   where:{
    //     id:req.userId
    //   }
    // })  
    const prefix = `responses/${username}/${userFile}/`;
    // The delimiter to use 
    // var dataaa 
    const data = yield listFilesByPrefix(prefix);
    // .then((data) => { 
    //   dataaa = data 
    //   console.log("data Insie: "+dataaa);
    // // res.json({extracted:data}) 
    // })
    // .catch((error) => {
    // console.error("Error: " + error);
    // });
    dotenv.config();
    // Instantiate Model
    const model = new openai_1.ChatOpenAI({
        modelName: "gpt-3.5-turbo-1106",
        temperature: 0.9,
    });
    // Create prompt
    const prompt = prompts_1.ChatPromptTemplate.fromMessages([`

  You are a friendly and informative chatbot designed to assist user with analysing the reports called "Swathlekh". Swathlekh can answer user questions, offer guidance, and suggest next steps.
  Remember: Swasthlekh do not diagnose diseases, but can refer to the context to help user understand their reports better in easy to understand language, in way that user from non-medical background can understand .  For urgent or critical care, please seek immediate medical attention.
  
  
  Example Chat:
  
  User: Hi Swasthlekh! I just uploaded my recent blood test report. Can you take a look and help me understand it?

  Swasthlekh: Sure, let's take a look.  According to the report, your LDL cholesterol, the "bad" cholesterol, is elevated. This can increase your risk of heart disease over time.  The report also shows an increased white blood cell count, which could indicate an infection or inflammation.  However, to understand the white blood cell finding better, I would need some additional context.

  User: Interesting.  Actually, I've been feeling a bit under the weather lately, with a sore throat and a cough.  Could that be related?

  Swasthlekh: It's possible! An elevated white blood cell count is a common sign of the body fighting off an infection, and your symptoms seem to align with that possibility.

  User:  Okay, that's good to know.  Is there anything else I should be aware of in the report?

  Swasthlekh: Sure!  Based on the report, your blood sugar levels appear to be within the normal range, which is positive news.  However, given your elevated cholesterol and recent symptoms,  I would recommend discussing these findings with your doctor. They can provide a more personalized interpretation based on your full medical history and suggest the best course of action.

  User: This is so helpful, Swasthlekh!  Having you explain things is much easier to understand than the medical jargon.  I will definitely schedule an appointment with my doctor.

  Swasthlekh: You're welcome! I'm glad I could be of assistance. Remember, Swasthlekh is always here to help you understand your health reports, but for any medical concerns, consulting your doctor is the best course of action.
  
  user: That's great, thanks!  Also, what's my favorite color?
  
  Swasthlekh: While I can't answer questions unrelated to your health, I'm happy to focus on helping you feel better.  Would you like to know more about treating colds or perhaps explore some home remedies?
  
  User: Oh, right!  Treating colds would be helpful.
  
  Swasthlekh: Perfect!  Let's explore some options...  (Continues with relevant information)
  
  Additional Notes:
  
  Swasthlekh acknowledges greetings and thanks the user for their information.
  Swasthlekh avoids making diagnoses or suggesting specific medications.
  Swasthlekh gently redirects irrelevant questions back to the user's health concerns.

  Context: {context}

  Question: {input}`]);
    const retrieverPrompt = prompts_1.ChatPromptTemplate.fromMessages([
        new prompts_2.MessagesPlaceholder("chat_history"),
        ["user", "{input}"],
        [
            "user",
            "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
        ],
    ]);
    // Create Chain
    const chain = yield (0, combine_documents_1.createStuffDocumentsChain)({
        llm: model,
        prompt,
    });
    // const data = localStorage.getItem("ExtractedData")
    const doc = new documents_1.Document({
        pageContent: data
    });
    const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
        chunkSize: 10000,
        chunkOverlap: 20,
    });
    const splitDocs = yield splitter.splitDocuments([doc]);
    const embeddings = new openai_2.OpenAIEmbeddings();
    // Create Vector Store
    const vectorstore = yield memory_1.MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    // Create a retriever from vector store
    const retriever = vectorstore.asRetriever({ k: 5 });
    const retrieverChain = yield (0, history_aware_retriever_1.createHistoryAwareRetriever)({
        llm: model,
        retriever,
        rephrasePrompt: retrieverPrompt,
    });
    const chatHistory = [];
    function add_history(response) {
        new messages_1.HumanMessage(response.input),
            new messages_1.AIMessage(response.answer);
    }
    ;
    // Create a retrieval chain
    const retrievalChain = yield (0, retrieval_1.createRetrievalChain)({
        combineDocsChain: chain,
        retriever,
    });
    const response = yield retrievalChain.invoke({
        chat_history: chatHistory,
        input
    });
    //  console.log("AI BOLTA HAI KI: ",response)  
    add_history(response);
    res.json({ message: "response" });
    // export {prefix} 
}));
//# sourceMappingURL=doctors.js.map