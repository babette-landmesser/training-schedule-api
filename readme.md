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
### Equipments
#### `POST /api/v1/equipments`
```
{
    name: string,
    type: string,
    stress_type: string,
    recommended_sets: string,
    info: string,
    recommended_duration?: number,
    recommended_repetition?: number,
    recommended_weight?: number
}
```

### Workouts
#### `POST /api/v1/workouts`
```
{}
```

### Sets
#### `POST /api/v1/sets`
```
{
    equipment_ids: number[],
    workout_id: number,
    duration?: number,
    repetition?: number,
    weight?: number
}
```

### Exercises
#### `POST /api/v1/exercises`
```
{
    equipment_id: number[],
    sets_id: number[]
}
```

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