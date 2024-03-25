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
const express_1 = __importDefault(require("express"));
const zodAuth_1 = __importDefault(require("./zodAuth"));
const client_1 = require("@prisma/client");
const jwt = require('jsonwebtoken');
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const secret = '1234hjkl';
router.get('/ts', (req, res) => {
    res.send('yoo backend is running in routes.ts');
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstname, lastname } = req.body;
    const zodVerfify = zodAuth_1.default.safeParse(username, password);
    const alreadyExist = yield prisma.user.findUnique({
        where: { username }
    });
    if (!zodVerfify.success) {
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
}));
exports.default = router;
