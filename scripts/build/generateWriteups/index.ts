import { generate } from './generate';
import { extractText } from './extractText';
import { extractMetaData } from './extractMetaData';
import { generateWriteupsIndex } from './generateIndex';

await Promise.all([generate(), extractText(), extractMetaData()]);
await generateWriteupsIndex();
