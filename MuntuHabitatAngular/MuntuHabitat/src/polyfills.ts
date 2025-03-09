import * as process from 'process'; // Import global de `process`
(window as any).process = process;

import { Buffer } from 'buffer'; // Import de `Buffer`
(window as any).Buffer = Buffer;

(window as any).global = window;
