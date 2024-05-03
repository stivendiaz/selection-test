# Usage Instructions:

1. Clone the repository to your local machine using the command: `git clone [repository-url]`.
2. Navigate to the project directory: `cd selection-test`.
3. Copy the `.env.example` file to `.env` runing: `cp .env.example .env`.
4. Be sure you have the node version specified in the `.nvmrc` file. If you don't have it, you can install it using the command: `nvm install`.
5. Install dependencies: `npm install`.
6. Generate database: `npm run prisma:generate:db`.
7. Build the project: `npm run build`.
8. Start the API server: `npm run dev` or `yarn dev`.
9. Access Swagger UI in your browser at `http://localhost:3001/docs/`.

## Before starting this project:

1. create an account on POST `auth/signup` and obtain the token
2. try to request 16 times the enpoint POST `auth/login` with the wrong password, after that the requests will be blocked for 1 minute
3. use the token to access the user endpoints: GET `users`, GET `users/:id`, PUT `users/:id` and DELETE `users/:id`

## API Specification

### Users

GET /users - Return all users

Response

```json
[
  {
    "id": "ae7bb93a-1903-41c9-ac5f-b9e54097e3b7",
    "email": "a@a.com",
    "name": "pedro",
    "createdAt": "2024-05-02T20:04:49.147Z",
    "updatedAt": "2024-05-02T20:04:49.147Z"
  },
  {
    "id": "ae7bb93a-1903-41c9-ac5f-b9e54097e3b7",
    "email": "b@b.com",
    "name": "pablo",
    "createdAt": "2024-05-02T20:04:49.147Z",
    "updatedAt": "2024-05-02T20:04:49.147Z"
  }
]
```

PUT /users/ - Update an user using a given id

Request

```json
[
  {
    "name": "pedro",
    "email": "a@a.com"
  }
]
```

Response

```json
{
  "id": "ae7bb93a-1903-41c9-ac5f-b9e54097e3b7",
  "name": "string",
  "email": "b@b.com",
  "verified": false,
  "createdAt": "2024-05-02T20:04:49.147Z",
  "updatedAt": "2024-05-02T20:04:49.147Z"
}
```

GET /users/{id} - Return the user for the given id

Response

```json
{
  "id": "ae7bb93a-1903-41c9-ac5f-b9e54097e3b7",
  "name": "string",
  "email": "b@b.com",
  "verified": false,
  "createdAt": "2024-05-02T20:04:49.147Z",
  "updatedAt": "2024-05-02T20:04:49.147Z"
}
```

DELETE /users/{id} - Delete the user with the given id

Response

```json
{
  "id": "ae7bb93a-1903-41c9-ac5f-b9e54097e3b7",
  "name": "string",
  "email": "b@b.com",
  "verified": false,
  "createdAt": "2024-05-02T20:04:49.147Z",
  "updatedAt": "2024-05-02T20:04:49.147Z"
}
```

### Auth

POST /auth/signup - Create a new user

Request

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

Response

```json
{
  "id": "ae7bb93a-1903-41c9-ac5f-b9e54097e3b7",
  "name": "pedro",
  "email": "a@a.com",
  "verified": false,
  "createdAt": "2024-05-02T20:04:49.147Z",
  "updatedAt": "2024-05-02T20:04:49.147Z"
}
```

POST /auth/login - Login

Request

```json
{
  "email": "string",
  "password": "string"
}
```

Response

```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFlN2JiOTNhLTE5MDMtNDFjOS1hYzVmLWI5ZTU0MDk3ZTNiNyIsImlhdCI6MTcxNDcxODU3NSwiZXhwIjoxNzE0NzI1Nzc1fQ.S7xsDfrX_phhM_vq5ZHfypZddAauH6CzPhiUlXYsg1s",
  "user": {
    "id": "ae7bb93a-1903-41c9-ac5f-b9e54097e3b7",
    "name": "string",
    "email": "b@b.com",
    "verified": false,
    "createdAt": "2024-05-02T20:04:49.147Z",
    "updatedAt": "2024-05-02T20:04:49.147Z"
  }
}
```

POST /auth/verify-reset-token - verify if is necesary reset the token

Request

```json
{
  "token": "string",
  "email": "string"
}
```

Response

```json
{
  "success": true
}
```

POST /auth/me - Return the user for the given token

Response

```json
{
  "email": "string",
  "id": "string",
  "name": "string",
  "verified": true,
  "createdAt": "2024-05-03T10:10:55.079Z",
  "updatedAt": "2024-05-03T10:10:55.079Z"
}
```
