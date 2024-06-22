"use strict";
// src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var app = (0, express_1.default)();
var PORT = 3000;
app.use(body_parser_1.default.json());
// Path to the JSON database file
var dbPath = path_1.default.resolve(__dirname, 'db.json');
// Initialize the database file if it doesn't exist
if (!fs_1.default.existsSync(dbPath)) {
    fs_1.default.writeFileSync(dbPath, JSON.stringify([]));
}
// Endpoint to check server status
app.get('/ping', function (req, res) {
    res.send(true);
});
// Endpoint to submit a new form
app.post('/submit', function (req, res) {
    var _a = req.body, name = _a.name, email = _a.email, phone = _a.phone, github_link = _a.github_link, stopwatch_time = _a.stopwatch_time;
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).send('All fields are required.');
    }
    var newSubmission = { name: name, email: email, phone: phone, github_link: github_link, stopwatch_time: stopwatch_time };
    var db = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
    db.push(newSubmission);
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.send('Submission successful');
});
// Endpoint to read a submission by index
app.get('/read', function (req, res) {
    var index = parseInt(req.query.index, 10);
    var db = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
    if (isNaN(index) || index < 0 || index >= db.length) {
        return res.status(400).send('Invalid index.');
    }
    res.json(db[index]);
});
app.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
});
