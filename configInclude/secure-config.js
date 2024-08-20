import 'dotenv/config';

export const secureConfig = {
    tokenSecret: process.env.TOKEN_SECRET,
    expToken: '100h',
};