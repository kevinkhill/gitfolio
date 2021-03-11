"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (request, response) => {
    const { name = 'World' } = request.query;
    response.status(200).send(`Hello ${name}!`);
};
