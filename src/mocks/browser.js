import { handlers } from './handlers'
const {setupWorker} = MockServiceWorker

export const worker = setupWorker(...handlers)
