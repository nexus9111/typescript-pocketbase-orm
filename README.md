# TypeScript ORM for PocketBase

The main goal of this project is to make it easier to use PocketBase with TypeScript. I created this to make it easier to use PocketBase with NestJS and to get an ORM similar to TypeORM or Mongoose.

# Usage

```typescript
import { PocketBaseORM } from "typescript-pocketbase-orm";
import { SortSide, findQuery } from 'typescript-pocketbase-orm/dist/interfaces';

const pb = new PocketBaseORM("http://localhost:8000");

await pb.authAdmin("admin", "admin");

const res = await pb.findAll({
    collection: "users",
    where: "email='test@test.com'",
    sortBy: {
        field: "email",
        side: SortSide.ASC
    },
    relations: ["posts"]
});

console.log(res);

const res2 = await pb.find({
    collection: "users",
    where: "email='test@test.com'",
    sortBy: {
        field: "email",
        side: SortSide.ASC
    },
    page: 1,
    limit: 10,
    relations: ["posts"]
});

console.log(res2);
```

# Types

All types are in `'typescript-pocketbase-orm/dist/interfaces'`

# Errors

All errors are in `'typescript-pocketbase-orm/dist/errors'`

```typescript
import { UnauthenticatedError, UnauthorizedError, SomethingWentWrongError, ResourceNotFoundError } from "typescript-pocketbase-orm/dist/errors";

try {
    await pb.authAdmin("admin", "admin");
} catch (e) {
    if (e instanceof UnauthenticatedError) {
        console.log("Unauthenticated");
    }
}

try {
    await pb.findAll({
        collection: "users",
        where: "email='test@test.com'",
        sortBy: {
            field: "email",
            side: SortSide.ASC
        },
        relations: ["posts"]
    });
} catch (e) {
    if (e instanceof SomethingWentWrongError) {
        console.log("Something went wrong");
    }

    if (e instanceof UnauthenticatedError) {
        console.log("Unauthenticated");
    }  

    if (e instanceof UnauthorizedError) {
        console.log("Unauthorized");
    }

    if (e instanceof ResourceNotFoundError) {
        console.log("Resource not found");
    }   
}
```

# Available methods

## authAdmin

```typescript
async authAdmin(username: string, password: string);
```

## authUser

```typescript
async authUser(username: string, password: string, userCollectionName: string = 'users');
```

## logout

```typescript
async logout();
```

## findAll

```typescript
async findAll(query: findAllQuery);
```

## find

```typescript
async find(query: findQuery);
```

## findFirst

```typescript
async findFirst(query: findFirstQuery);
```

## findById

```typescript
async findById(query: findByIdQuery);
```

## create

```typescript
async create(collection: string, data: any);
```

## update

```typescript
async update(collection: string, id: string, data: any);
```

## delete

```typescript
async delete(collection: string, id: string);
```

## verifyToken

```typescript
async verifyToken(token: string, userCollectionName: string = 'users');
```

## loadToken

```typescript
async loadToken(token: string);
```

# auhor

[nexus9111](https://github.com/nexus9111)