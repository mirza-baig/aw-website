import config from 'aw.config';

import { LeverService } from './leverservice';

const leverService = new LeverService(config.lever);

export default leverService;
