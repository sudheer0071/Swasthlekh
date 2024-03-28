"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./routes/index");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const hellop = 'sdf';
// yaad rehne wala error
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v3', index_1.router);
app.get('/', (req, res) => {
    res.send("backend is working fine in index.ts");
});
app.listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map