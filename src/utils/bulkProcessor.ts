export const processInBatches = async <T>(
    items: T[],
    batchSize: number,
    processBatch: (batch: T[]) => Promise<void>
): Promise<void> => {

    for (let i = 0; i < items.length; i += batchSize) {

        const batch = items.slice(i, i + batchSize);

        await processBatch(batch);

        console.log(
            `Processed ${Math.min(i + batchSize, items.length)} of ${items.length} records`
        );
    }
};

export const generateAndProcessBatches = async <T>(
    totalCount: number,
    batchSize: number,
    generateBatch: (startIndex: number, batchSize: number) => T[],
    processBatch: (batch: T[]) => Promise<void>
): Promise<void> => {

    for (let i = 0; i < totalCount; i += batchSize) {

        const currentBatchSize = Math.min(
            batchSize,
            totalCount - i
        );

        const batch = generateBatch(i, currentBatchSize);

        await processBatch(batch);

        console.log(
            `Processed ${Math.min(i + currentBatchSize, totalCount)} of ${totalCount} records`
        );
    }
};