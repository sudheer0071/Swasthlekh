"use strict";
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
const storage_1 = require("@google-cloud/storage");
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
    return __awaiter(this, arguments, void 0, function* ({ blobname, filename, bucketname }) {
        try {
            const bucket = storageClient.bucket(bucketname);
            const blob = bucket.file(blobname);
            yield blob.save(filename);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
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
            const filePath = `${folderName}/${resposne.filename}`; // Path to the file within the folder
            const bucket = storageClient.bucket(bucketName);
            const blob = bucket.file(filePath);
            yield blob.save(resposne.data, { contentType: 'application/pdf' });
            res.json({ message: "Report is uploaded successfully! ", data: { filename: resposne.filename, data: resposne.data } });
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
        res.json(files);
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
route.get('/', middleware_1.userAuth);
//# sourceMappingURL=users.js.map