export function LogExecution(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`[LOG] Executing method '${propertyKey}' with arguments:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`[LOG] Method '${propertyKey}' executed successfully.`);
    return result;
  };
  return descriptor;
}