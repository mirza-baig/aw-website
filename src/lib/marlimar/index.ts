import config from 'aw.config';

import { MarlimarService } from './marlimar-service';

const service = new MarlimarService(config.marlimar);

export default service;
