import { generate } from './generate';
import { extractText } from './extractText';
import { extractMetaData } from './extractMetaData';
import { generateBlogsIndex } from './generateIndex';

await Promise.all([generate(), extractText(), extractMetaData()]);
await generateBlogsIndex();
