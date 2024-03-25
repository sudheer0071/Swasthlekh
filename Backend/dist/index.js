"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use('/api/v3', routes_1.default);
app.get('/', (req, res) => {
    res.send("backend is working fine in index.ts");
});
app.listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
});
