# Setup
## Pre-requisites
### Local database
- database name: training-schedule

 
## Installation
1. clone repository
2. `cd training-schedule-api`
3. `npm install`
4. set your local database credentials in .env file. 

## Run App
`npm run start`


# Available Endpoints
### Login
#### `POST /api/v1/login`
```
{
    name: string,
    password: string
}
```

### Users
#### `POST /api/v1/users/update-password`
```
{
    id: number,
    oldPassword: string,
    newPassword: string,
    passwordConfirm: string,
}
```