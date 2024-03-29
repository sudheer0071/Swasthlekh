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
exports.route1 = void 0;
const express_1 = __importDefault(require("express"));
const zodAuth_1 = require("../zodAuth");
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
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
        return res.json({ message: "User doesn't esixt" });
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
            return res.json({ message: 'user with username: "' + username + '" does not exist in database' });
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
    const { filename, username } = req.body;
    console.log("userid: " + req.userId);
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
        console.log("inside the fileee");
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
//# sourceMappingURL=doctors.js.map