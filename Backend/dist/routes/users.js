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
exports.secret = exports.route = void 0;
const express_1 = __importDefault(require("express"));
const zodAuth_1 = require("../zodAuth");
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const stream_1 = require("stream");
const path_1 = __importDefault(require("path"));
const openai_1 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const agents_1 = require("langchain/agents");
const tavily_search_1 = require("@langchain/community/tools/tavily_search");
const retriever_1 = require("langchain/tools/retriever");
const text_splitter_1 = require("langchain/text_splitter");
const openai_2 = require("@langchain/openai");
const memory_1 = require("langchain/vectorstores/memory");
const prompts_2 = require("@langchain/core/prompts");
const messages_1 = require("@langchain/core/messages");
const documents_1 = require("@langchain/core/documents");
// Import environment variables
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const storage_1 = require("@google-cloud/storage");
const vision = __importStar(require("@google-cloud/vision"));
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './winter-flare-414016-a7dd7ec7508f.json';
const storageClient = new storage_1.Storage();
const bucketname = 'swasthlekh_bucket';
const jwt = require('jsonwebtoken');
const route = express_1.default.Router();
exports.route = route;
const prisma = new client_1.PrismaClient();
const secret = '1234hjkl';
exports.secret = secret;
route.get('/ts', (req, res) => {
    res.send('yoo backend is running in users.ts');
});
// it should work 
//  interface reqRes {
//   req:Request,
//   res:Response
// }
route.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, firstname, lastname } = req.body;
        const zodVerfify = zodAuth_1.signUpSchema.safeParse(req.body);
        const alreadyExist = yield prisma.user.findUnique({
            where: { username }
        });
        if (!zodVerfify.success) {
            console.log(zodVerfify);
            return res.json({ message: "make sure to add correct email" });
        }
        if (alreadyExist) {
            return res.json({ message: "username already exist , try something unique" });
        }
        const user = yield prisma.user.create({
            data: { username, password, firstname, lastname }
        });
        const token = jwt.sign({ userId: user.id }, secret);
        res.json({ message: "User created successfully", token: token });
    }
    catch (error) {
        return res.json({ message: "Backend Route Error" });
    }
}));
route.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const zodVerfify = zodAuth_1.signinSchema.safeParse(req.body);
        const exist = yield prisma.user.findUnique({
            where: { username }
        });
        const user = yield prisma.user.findUnique({
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
    }
    catch (error) {
        return res.json({ message: "Backend is down", Error: error });
    }
}));
route.put('/', middleware_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname } = req.body;
    const update = req.userId;
    yield prisma.user.update({
        where: { id: req.userId },
        data: { firstname, lastname }
    });
    res.json({ message: "Details updated sucessfully!" });
}));
// initializing multer
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
// initializind cloud storage
function uploadToBucket(_a) {
    return __awaiter(this, arguments, void 0, function* ({ blobname, data, bucketname }) {
        try {
            console.log("inside upload...");
            const bucket = storageClient.bucket(bucketname);
            const blob = bucket.file(blobname);
            yield blob.save(data, { contentType: 'application/pdf' });
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    });
}
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
                data += annotation.text;
            }
        }));
        yield Promise.all(promises);
        return data;
    });
}
route.post('/upload', middleware_1.userAuth, upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pdfs will be uploaded to this route
    try {
        if (!req.file) {
            console.log("no file");
            return res.json({ message: "File is not uploaded" });
        }
        const { originalname, buffer } = req.file;
        console.log(req.file);
        console.log("filename: " + originalname);
        const already = yield prisma.file.findUnique({
            where: { filename: originalname }
        });
        if (already) {
            return res.json({ message: "File already exist" });
        }
        else {
            console.log("creating... ");
            const resposne = yield prisma.file.create({
                data: {
                    filename: originalname,
                    userId: req.userId,
                    mimettype: req.file.mimetype,
                    encoding: req.file.encoding,
                    data: buffer,
                    date: new Date(),
                    time: new Date()
                }
            });
            const user = yield prisma.user.findUnique({ where: { id: req.userId } });
            console.log("date: " + resposne.date.getDate());
            console.log("time: " + resposne.date);
            const bucketName = bucketname; // Your bucket name
            const folderName = user === null || user === void 0 ? void 0 : user.username; // Folder name (username in this case)
            const filePath = `files/${folderName}/${resposne.filename}`; // Path to the file within the folder
            yield uploadToBucket({ blobname: filePath, data: resposne.data, bucketname: bucketName });
            // const bucket = storageClient.bucket(bucketName);
            // const blob = bucket.file(filePath);
            // await blob.save(resposne.data, { contentType: 'application/pdf' });
            res.json({ message: "Report is uploaded successfully! ", data: { filename: resposne.filename, data: resposne.data } });
            console.log("userfile: " + resposne.filename);
            console.log("username: " + user.username);
            // // The ID of your GCS bucket 
            const uploaded_file = `${user.username}/${resposne.filename}`;
            const source_file = `gs://${bucketName}/files/${uploaded_file}`;
            const extracted_json = `gs://${bucketName}/responses/${uploaded_file}/`;
            process.env.GOOGLE_APPLICATION_CREDENTIALS = "winter-flare-414016-a7dd7ec7508f.json";
            // // // Rest of your code
            const client = new vision.ImageAnnotatorClient();
            const gcsSourceUri = source_file;
            const gcsDestinationUri = extracted_json;
            const inputConfig = {
                mimeType: 'application/pdf',
                gcsSource: {
                    uri: gcsSourceUri,
                },
            };
            const outputConfig = {
                gcsDestination: {
                    uri: gcsDestinationUri,
                },
            };
            const features = [{ type: 'DOCUMENT_TEXT_DETECTION' }];
            const request = {
                requests: [
                    {
                        inputConfig: inputConfig,
                        features: features,
                        outputConfig: outputConfig,
                    },
                ],
            };
            const [operation] = yield client.asyncBatchAnnotateFiles(request);
            const [filesResponse] = yield operation.promise();
            // const destinationUri = filesResponse.responses[0].outputConfig.gcsDestination.uri;
            // console.log('Json saved to: ' + destinationUri);
            //////////////////////////////////////
            // GETTING BACK THE EXTARCTED DATA///
            ////////////////////////////////////  
        }
    }
    catch (error) {
        res.json({ message: "Error in uploading", Error: error });
        console.log("user id: " + req.userId);
        console.log(error);
    }
}));
route.post('/reports', middleware_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma.user.findUnique({
            where: { id: req.userId },
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
            return res.json({ message: 'You have no files' });
        }
        if (response.files.length == 0) {
            return res.json({ message: "You have no reports" });
        }
        const files = response.files.map((file) => ({
            filename: file.filename,
            date: new Date(file.date).toString() // Assuming file.date is a Date object
        }));
        console.log(files);
        res.json({ message: "showing reports", files: files });
    }
    catch (error) {
        res.json({ message: "No resports associated with username: " });
    }
}));
route.post('/pdf', middleware_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.body;
    console.log(req.userId);
    const user = yield prisma.user.findUnique({
        where: { id: req.userId },
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
}));
route.get('/logs', middleware_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { id: req.userId }
    });
    const logs = yield prisma.user.findUnique({
        where: {
            username: user.username
        },
        include: {
            logs: {
                include: {
                    accessedFiles: true
                }
            }
        }
    });
    const dateOptions = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    const all_logs = logs.logs.map((log) => ({
        doctor: log.doctorEmail,
        accessedFiles: log.accessedFiles.map((file) => ({
            actions: file.actions,
            date: new Date(file.date).toLocaleString('en-US', dateOptions),
            filename: file.filename
        }))
    }));
    console.log("showing logs.." + all_logs);
    res.json({ message: "laoding logs... ", logs: all_logs });
}));
// logs should be looks like this
// logs:[
//   doctor: 'charan@gmail.com',
//   accessdFiles:{
//     {
//       date:'23 Mar 2024',
//       filename: 'abc.txt'
//     },
//     {
//       date:'23 Mar 2024',
//       filename: 'abc.txt'
//     }
//   }
// ] 
route.post('/chat', middleware_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userFile, input } = req.body;
        const user = yield prisma.user.findUnique({
            where: {
                id: req.userId
            }
        });
        const prefix = `responses/${user.username}/${userFile}/`;
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
        const doc = new documents_1.Document({
            pageContent: data
        });
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 200,
            chunkOverlap: 20,
        });
        const splitDocs = yield splitter.splitDocuments([doc]);
        const embeddings = new openai_2.OpenAIEmbeddings();
        const vectorStore = yield memory_1.MemoryVectorStore.fromDocuments(splitDocs, embeddings);
        const retriever = vectorStore.asRetriever({
            k: 5,
        });
        // Instantiate the model
        const model = new openai_1.ChatOpenAI({
            modelName: "gpt-3.5-turbo-1106",
            temperature: 0.7,
        });
        // Prompt Template
        const prompt = prompts_1.ChatPromptTemplate.fromMessages([`
  "User",
    You are a friendly and informative chatbot designed to assist user with analysing the reports called "Swathlekh". Swathlekh can answer user questions, offer guidance, and suggest next steps.
    Remember: Swasthlekh do not diagnose diseases, but can refer to the reports to help user understand their reports better in easy to understand language, in way that user from non-medical background can understand .  For urgent or critical care, please seek immediate medical attention.
    IMPORTANT:
    
    Swasthlekh acknowledges greetings and thanks the user for their information,
    Swasthlekh avoids making diagnoses or suggesting specific medications,
    Swasthlekh gently redirects irrelevant questions back to the user's health concerns.
    
   Refer the following "Example Chat" - Dont directly use this in converstion,
    
    User: Hi Swasthlekh! My name is raju, I just uploaded my recent report. Can you take a look and help me understand it?
  
    Swasthlekh: Sure raju, let's take a look.  According to the report, your LDL cholesterol, the "bad" cholesterol, is elevated. This can increase your risk of heart disease over time.  The report also shows an increased white blood cell count, which could indicate an infection or inflammation.  However, to understand the white blood cell finding better, I would need some additional context.
  
    User: Interesting.  Actually, I've been feeling a bit under the weather lately, with a sore throat and a cough.  Could that be related?
  
    Swasthlekh: It's possible! An elevated white blood cell count is a common sign of the body fighting off an infection, and your symptoms seem to align with that possibility.
  
    User:  Okay, that's good to know.  Is there anything else I should be aware of in the report?
  
    Swasthlekh: Sure!  Based on the report, your blood sugar levels appear to be within the normal range, which is positive news.  However, given your elevated cholesterol and recent symptoms,  I would recommend discussing these findings with your doctor. They can provide a more personalized interpretation based on your full medical history and suggest the best course of action.
  
    User: This is so helpful, Swasthlekh!  Having you explain things is much easier to understand than the medical jargon.  I will definitely schedule an appointment with my doctor.
  
    Swasthlekh: You're welcome raju! I'm glad I could be of assistance. Remember, Swasthlekh is always here to help you understand your health reports, but for any medical concerns, consulting your doctor is the best course of action.
    
    user: That's great, thanks!  Also, what's my favorite color?
    
    Swasthlekh: While I can't answer questions unrelated to your health, I'm happy to focus on helping you feel better.  Would you like to know more about treating colds or perhaps explore some home remedies?
    
    User: Oh, right!  Treating colds would be helpful.
    
    Swasthlekh: Perfect!  Let's explore some options...  (Continues with relevant information)
    
  
  `,
            new prompts_2.MessagesPlaceholder("chat_history"),
            ("{input}"),
            new prompts_2.MessagesPlaceholder("agent_scratchpad"),
        ]);
        // Tools
        const searchTool = new tavily_search_1.TavilySearchResults();
        const retrieverTool = (0, retriever_1.createRetrieverTool)(retriever, {
            name: "report_search",
            description: "use this when user asks the first query",
        });
        const tools = [searchTool, retrieverTool];
        const agent = yield (0, agents_1.createOpenAIFunctionsAgent)({
            llm: model,
            tools,
            prompt,
        });
        // Create the executor
        const agentExecutor = new agents_1.AgentExecutor({
            agent,
            tools,
        });
        // const rl = readline.createInterface({
        //   input: process.stdin,
        //   output: process.stdout,
        // });
        const chat_history = [];
        // function askQuestion() {
        //   rl.question("User: ", async (input) => {
        //     if (input.toLowerCase() === "exit") {
        //       rl.close();
        //       return;
        //     } 
        const response = yield agentExecutor.invoke({
            input: input, //userinput
            chat_history: chat_history,
        });
        // console.log("Agent: ", response.output);
        chat_history.push(new messages_1.HumanMessage(response.input));
        chat_history.push(new messages_1.AIMessage(response.output));
        res.json({ message: response.output });
    }
    catch (error) {
        console.log(error);
        res.json({ message: 'Bot is down' });
    }
    // export {prefix} 
}));
route.get('/access', middleware_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: { id: req.userId }
    });
    console.log("username: " + user.username);
    const access = yield prisma.accessReport.findMany({
        where: {
            user: user.username,
        },
        select: {
            doctor: true,
            date: true
        }
    });
    const dateOptions = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    const accessed = access.map((acces) => ({
        doctor: acces.doctor,
        date: new Date(acces.date).toLocaleString('en-US', dateOptions),
    }));
    console.log("accessed: " + accessed.length);
    res.json({ message: "creating access", access: accessed });
}));
//# sourceMappingURL=users.js.map