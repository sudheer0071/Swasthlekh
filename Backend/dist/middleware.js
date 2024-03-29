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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const jwt = require('jsonwebtoken');
const users_1 = require("./routes/users");
function userAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = req.headers.authorization;
        try {
            console.log(auth);
            if (auth != null) {
                const token = auth.split(' ')[1];
                if (!auth || !auth.startsWith('Bearer ')) {
                    return res.json({ message: "Token error" });
                }
                const decode = jwt.verify(token, users_1.secret);
                req.userId = decode.userId;
                console.log(req.userId);
                return next();
            }
        }
        catch (error) {
            res.json({ message: "Error" });
        }
    });
}
exports.userAuth = userAuth;
//# sourceMappingURL=middleware.js.map