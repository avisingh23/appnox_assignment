import { initContext, loadContext } from '../context';
import { IApp } from './types';

export class ConsoleApp implements IApp {
    async bootstrap(): Promise<void> {
        await initContext();
    }

    async serve(): Promise<void> {
        // eslint-disable-next-line no-console
        console.log(`⚡️[console]: Console app is running`);
    }

    getCtx() {
        return loadContext();
    }

    // down(): Promise<void> {
    //     return loadContext().down();
    // }
}
