"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const { route } = require('./users');
const { route1 } = require('./doctors');
const router = express_1.default.Router();
exports.router = router;
router.use('/users', route);
router.use('/doctors', route1);
router.get('/', (req, res) => {
    res.send("backend is working fine for index.js route inside routes folder");
});
//# sourceMappingURL=index.js.map