import config from 'aw.config.server';

import { LeverService } from './leverservice';

const leverService = new LeverService(config.lever);

export default leverService;
