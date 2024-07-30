import { ErrorPocketBaseConnection, InternalServerError, ResourceNotFoundError, SomethingWentWrongError, UnauthenticatedError, UnauthorizedError } from "./errors";
import { PocketBaseError, SortSide, findAllQuery, findByIdQuery, findFirstQuery, findQuery } from "./interfaces";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PocketBase = require('pocketbase/cjs');

interface data {
    filter?: string;
    sort?: string;
    expand?: string;
}

const getData = (obj: findAllQuery | findQuery | findFirstQuery) => {
    const useSort = obj?.sortBy?.field && obj?.sortBy?.side;

    const data: data = {}

    if (obj.where) {
        data.filter = obj.where;
    }

    if (useSort) {
        data.sort = `${obj?.sortBy?.side === SortSide.ASC ? '' : '-'}${obj?.sortBy?.field}`;
    }

    if (obj.relations) {
        data.expand = obj.relations.join(',');
    }

    return data;
}

const processError = (error: any) => {
    let e = error as PocketBaseError;

    if (e.status === 400) {
        throw new SomethingWentWrongError(e.response.message);
    }

    if (e.status === 401) {
        throw new UnauthenticatedError(e.response.message);
    }

    if (e.status === 403) {
        throw new UnauthorizedError(e.response.message);
    }

    if (e.status === 404) {
        throw new ResourceNotFoundError(e.response.message);
    }

    throw new InternalServerError("Something went wrong");
}

export class PocketBaseORM {
    private pocketbase: typeof PocketBase;

    constructor(url: string) {
        try {
            this.pocketbase = new PocketBase(url);
        } catch (error) {
            throw new ErrorPocketBaseConnection("Could not connect to PocketBase");
        }
    }

    public async authAdmin(username: string, password: string) {
        try {
            return await this.pocketbase.admins.authWithPassword(username, password);
        } catch (error) {
            processError(error);
        }
    }

    public async refreshAdmin() {
        try {
            return await this.pocketbase.admins.authRefresh();
        } catch (error) {
            processError(error);
        }
    }

    public async authUser(username: string, password: string, userCollectionName: string = 'users') {
        try {
            return await this.pocketbase.collection(userCollectionName).authWithPassword(username, password);
        } catch (error) {
            processError(error);
        }
    }

    public async refreshUser(userCollectionName: string = 'users') {
        try {
            return await this.pocketbase.collection(userCollectionName).authRefresh();
        } catch (error) {
            processError(error);
        }
    }

    public async logout() {
        try {
            return await this.pocketbase.authStore.clear();
        } catch (error) {
            processError(error);
        }
    }

    public async findAll(query: findAllQuery) {
        try {
            const data: data = getData(query);
            const res = await this.pocketbase.collection(query.collection).getFullList(data);
            return res;
        } catch (error) {
            processError(error);
        }
    }

    public async find(query: findQuery) {
        try {
            const data: data = getData(query);
            const res = await this.pocketbase.collection(query.collection).getList(query.page, query.limit, data);
            return res;
        } catch (error) {
            processError(error);
        }
    }

    public async findFirst(query: findFirstQuery) {
        try {
            const data: data = getData(query);
            const res = await this.pocketbase.collection(query.collection).getFirstListItem(query.where, data);
            return res;
        } catch (error) {
            processError(error);
        }
    }

    public async findById(query: findByIdQuery) {
        try {
            const res = await this.pocketbase.collection(query.collection).getOne(query.id);
            return res;
        } catch (error) {
            processError(error);
        }
    }

    public async create(collection: string, data: any) {
        try {
            const res = await this.pocketbase.collection(collection).create(data);
            return res;
        } catch (error) {
            processError(error);
        }
    }

    public async update(collection: string, id: string, data: any) {
        try {
            const res = await this.pocketbase.collection(collection).update(id, data);
            return res;
        } catch (error) {
            processError(error);
        }
    }

    public async delete(collection: string, id: string) {
        try {
            const res = await this.pocketbase.collection(collection).delete(id);
            return res;
        } catch (error) {
            processError(error);
        }
    }

    public async verifyToken(token: string, userCollectionName: string = 'users') {
        try {
            this.pocketbase.authStore.save(token, null);
            await this.refreshUser(userCollectionName);
        } catch (error) {
            processError(error);
        }
    }

    public loadToken(token: string) {
        try {
            this.pocketbase.authStore.save(token, null);
        } catch (error) {
            processError(error);
        }
    }
}