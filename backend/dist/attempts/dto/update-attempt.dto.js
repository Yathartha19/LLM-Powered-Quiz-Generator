"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAttemptDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_attempt_dto_1 = require("./create-attempt.dto");
class UpdateAttemptDto extends (0, mapped_types_1.PartialType)(create_attempt_dto_1.CreateAttemptDto) {
}
exports.UpdateAttemptDto = UpdateAttemptDto;
//# sourceMappingURL=update-attempt.dto.js.map