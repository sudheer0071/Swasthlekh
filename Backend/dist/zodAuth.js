"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinSchema = exports.signUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const signUpSchema = zod_1.default.object({
    firstname: zod_1.default.string(),
    lastname: zod_1.default.string().optional(),
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(5)
});
exports.signUpSchema = signUpSchema;
const signinSchema = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(5)
});
exports.signinSchema = signinSchema;
//# sourceMappingURL=zodAuth.js.map