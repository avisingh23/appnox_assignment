import _ from 'lodash';
import { IPaginationParams, ISortByParams } from '../controllers/types';

export class RequestHelper {
    static parsePaginationParams(paginationParams: IPaginationParams) {
        const offset = paginationParams.offset ? Number(paginationParams.offset) : 0;
        const limit = paginationParams.limit ? Number(paginationParams.limit) : null;
        return {
            offset,
            limit,
        };
    }

    /**
     * sortBy query param should be defined as name:DESC,age:ASC
     */
    static parseSortByParams(sortByParams: ISortByParams) {
        const sortByString = sortByParams.sortBy || '';
        const sortBy = sortByString.split(',').reduce((sortingObject: any, sortItem: string) => {
            const [field, sortType] = sortItem.trim().split(':');
            if (field) {
                let sortOrder = -1;
                if (['ASC', 'DESC'].includes(sortType) && sortType === 'ASC') {
                    sortOrder = 1;
                }
                // eslint-disable-next-line no-param-reassign
                sortingObject[field] = sortOrder;
            }
            return sortingObject;
        }, {});
        return !_.isEmpty(sortBy) ? sortBy : null;
    }

    static parseConditionalFilterParam(param: string) {
        // by default we are using pipe separator. If this conflicts with any input in future, we
        // can support custom separator for each from query param
        const fieldCriteria = param.split('|').reduce((fieldCriteriaObject: any, paramItem: string) => {
            const [criteriaType, criteriaValue] = paramItem.trim().split(':');
            let criteriaMongoType = '$eq';
            let criteriaMongoValue: string | string[] = _.isUndefined(criteriaValue) ? criteriaType : criteriaValue;
            if (criteriaType && !_.isUndefined(criteriaValue)) {
                switch (criteriaType) {
                    case 'eq':
                        criteriaMongoType = '$eq';
                        break;
                    case 'ne':
                        criteriaMongoType = '$ne';
                        break;
                    case 'in':
                        criteriaMongoType = '$in';
                        criteriaMongoValue = criteriaValue.split(',');
                        break;
                    case 'nin':
                        criteriaMongoType = '$nin';
                        criteriaMongoValue = criteriaValue.split(',');
                        break;
                    case 'lt':
                        criteriaMongoType = '$lt';
                        break;
                    case 'lte':
                        criteriaMongoType = '$lte';
                        break;
                    case 'gt':
                        criteriaMongoType = '$gt';
                        break;
                    case 'gte':
                        criteriaMongoType = '$gte';
                        break;
                    default:
                        break;
                }
            }
            // eslint-disable-next-line no-param-reassign
            fieldCriteriaObject[criteriaMongoType] = criteriaMongoValue;
            return fieldCriteriaObject;
        }, {});
        return !_.isEmpty(fieldCriteria) ? fieldCriteria : null;
    }
}
