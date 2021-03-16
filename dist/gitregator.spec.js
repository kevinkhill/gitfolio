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
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const path_1 = __importDefault(require("path"));
const gitregator_1 = __importDefault(require("./gitregator"));
const getClient = () => {
    var _a;
    return new gitregator_1.default({
        username: "kevinkhill",
        apiKey: (_a = process.env.GITHUB_API_KEY) !== null && _a !== void 0 ? _a : ""
    });
};
const getLocalGitregatorFile = () => {
    const file = path_1.default.join(__dirname, "..", gitregator_1.default.GITREGATOR_FILENAME);
    return js_yaml_1.default.load(fs_1.default.readFileSync(file, "utf8"));
};
test("process.env.GITHUB_API_KEY", () => __awaiter(void 0, void 0, void 0, function* () {
    expect(process.env.GITHUB_API_KEY).toBeDefined();
}));
test("gitregator.getInfoFromRepo()", () => __awaiter(void 0, void 0, void 0, function* () {
    const local = getLocalGitregatorFile();
    const remote = yield getClient().getInfoFromRepo("gitregator");
    expect(remote).toMatchObject(local);
}));
test("gitregator.getUserRepoTitles()", () => __awaiter(void 0, void 0, void 0, function* () {
    const titles = yield getClient().getUserRepoTitles();
    expect(titles.length).toBeGreaterThan(0);
}));
