import 'dotenv/config';

export const configServer = {
    port: process.env.PORT,
    db_login: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    ALLOWED_ORIGIN: 'http://localhost:5173',
    db_connect_string: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9qwc1.mongodb.net/${process.env.DB_NAMEDB}?retryWrites=true&w=majority&appName=Cluster0`,
    collections: {
        user : 'users',
        userAdmin: 'user-admins',
        ticket: 'tickets',
        message: 'messages'

    },
    uploadDir: '/upload/'
};