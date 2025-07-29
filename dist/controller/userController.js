"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../application/database");
const get = async (req, res, next) => {
    try {
        const user = await database_1.prismaClient.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                personId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return res.status(200).json({
            message: "success",
            data: user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    get
};
//# sourceMappingURL=userController.js.map