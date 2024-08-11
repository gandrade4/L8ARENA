"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express"); // O `Router` divide o nosso servidor em seções
const controllers_1 = require("../../controllers");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', (_, res) => {
    return res.send('ola');
});
router.post('/usuarios', /* UserController.createValidation,*/ controllers_1.UserController.create);
