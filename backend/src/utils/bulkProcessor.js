"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAndProcessBatches = exports.processInBatches = void 0;
const processInBatches = async (items, batchSize, processBatch) => {
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        await processBatch(batch);
        console.log(`Processed ${Math.min(i + batchSize, items.length)} of ${items.length} records`);
    }
};
exports.processInBatches = processInBatches;
const generateAndProcessBatches = async (totalCount, batchSize, generateBatch, processBatch) => {
    for (let i = 0; i < totalCount; i += batchSize) {
        const currentBatchSize = Math.min(batchSize, totalCount - i);
        const batch = generateBatch(i, currentBatchSize);
        await processBatch(batch);
        console.log(`Processed ${Math.min(i + currentBatchSize, totalCount)} of ${totalCount} records`);
    }
};
exports.generateAndProcessBatches = generateAndProcessBatches;
