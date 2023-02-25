import { IContext } from '../context/types';
import { EventTypes } from './types';

export function registerLoginEvents(ctx: IContext) {
    ctx.eventEmitter.on(EventTypes.UserLogin, (data: any) => {
        ctx.logger.info(`${EventTypes.UserLogin} event called`);
        ctx.logger.info(data);
    });
}
