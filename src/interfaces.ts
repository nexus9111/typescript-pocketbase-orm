export interface PocketBaseError {
    status: number; 
    response: {
        message: string;
    }
}

export enum SortSide {
    ASC = "asc",
    DESC = "desc"
}

export interface findAllQuery {
    collection: string;
    where?: string;
    sortBy?: {
        field: string;
        side: SortSide;
    };
    relations?: string[];
}

export interface findQuery {
    collection: string;
    where?: string;
    sortBy?: {
        field: string;
        side: SortSide;
    };
    page: number;
    limit: number;
    relations?: string[];
}

export interface findByIdQuery {
    id: string;
    collection: string;
}

export interface findFirstQuery {
    collection: string;
    where: string;
    sortBy?: {
        field: string;
        side: SortSide;
    };
    relations?: string[];
}

export interface ResetPasswordQuery {
    token: string;
    password: string;
    repeatPassword: string;
  }