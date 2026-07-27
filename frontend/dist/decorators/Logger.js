"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogExecution = LogExecution;
function LogExecution(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`[LOG] Executing method '${propertyKey}' with arguments:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`[LOG] Method '${propertyKey}' executed successfully.`);
        return result;
    };
    return descriptor;
}
