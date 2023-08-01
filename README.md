[![N|Solid](https://iili.io/Hi9giog.png)](https://www.enverx.com/)

EnverX offers a simple and convenient platform to fund early-stage projects
and trade future carbon credits.

## _Assignment For Backend Developer Role (Submission)_

### Instructions

1. Clone the repository
2. Run `yarn` to install all the dependencies
3. Create a `.env` file in the root directory and add the following variables
    ```
    dbURI = <MongoDB URI>
    JWT_SECRET = <JWT Secret>
    ```
4. Run `yarn start` to start the server
5. Project will be running on `http://localhost:8000`

### API Documentation

Postman collection has been provided in the root directory of the project. Import the collection in Postman to view the documentation.

### Additional Improvements
1. Added pagination to fetch posts API
2. Cookie based authentication
3. Added functionality to fetch all posts created by a user

### Database Schema

#### User

```
{
    username: String,
    email: String,
    password: String,
    avatar: String,
    createdAt: Date
}
```

#### Post

```
{
    title: String (max 100 characters),
    content: String (max 1000 characters),
    category: String (Enum),
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}
```

#### Post Categories
1. Technology
2. Travel
3. Food
4. Health
5. Personal Development
6. Fashion
7. Parenting
8. Home & Decor
9. Finance
10. Books & Literature
11. Entertainment
12. Lifestyle
13. Photography
14. Education
15. Environment
16. Art
