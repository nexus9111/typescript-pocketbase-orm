import { SortSide, findAllQuery, findByIdQuery, findFirstQuery, findQuery } from "./interfaces";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PocketBase = require('pocketbase/cjs');

interface data {
    filter?: string;
    sort?: string;
    expand?: string[];
}

const getData = (obj : findAllQuery | findQuery | findFirstQuery) => {
    const useSort = obj?.sortBy?.field && obj?.sortBy?.side;

    const data: data = {}

    if (obj.where) {
        data.filter = obj.where;
    }

    if (useSort) {
        data.sort = `${obj?.sortBy?.side === SortSide.ASC ? '' : '-'}${obj?.sortBy?.field}`;
    }

    if (obj.relations) {
        data.expand = obj.relations;
    }

    return data;
}   

export class PocketBaseORM {
    private pocketbase: typeof PocketBase;

    constructor(url: string) {
        this.pocketbase = new PocketBase(url);
    }

    public async authAdmin(username: string, password: string) {
        return await this.pocketbase.admins.authWithPassword(username, password);
    }

    public async authUser(username: string, password: string, userCollectionName: string = 'users') {
        return await this.pocketbase.collection(userCollectionName).authWithPassword(username, password);
    }

    public async logout() {
        return await this.pocketbase.authStore.clear();
    }

    public async findAll(query: findAllQuery) {
        const data: data = getData(query);

        const res = await this.pocketbase.collection(query.collection).getFullList(data);

        return res;
    }

    public async find(query: findQuery) {
        const data: data = getData(query);

        const res = await this.pocketbase.collection(query.collection).getList(query.page, query.limit, data);

        return res;
    }

    public async findFirst(query: findFirstQuery) {
        const data: data = getData(query);

        const res = await this.pocketbase.collection(query.collection).getFirstListItem(query.where, data);

        return res;
    }

    public async findById(query: findByIdQuery) {
        const res = await this.pocketbase.collection(query.collection).getOne(query.id);

        return res;
    }

    public async create(collection: string, data: any) {
        const res = await this.pocketbase.collection(collection).create(data);

        return res;
    }

    public async update(collection: string, id: string, data: any) {
        const res = await this.pocketbase.collection(collection).update(id, data);

        return res;
    }

    public async delete(collection: string, id: string) {
        const res = await this.pocketbase.collection(collection).delete(id);

        return res;
    }
}