
import jwt from 'jsonwebtoken';
import {TOKEN_SECRET}from '../config.js'
//const secretKey = "K123"; // Debes considerar almacenar esto en una variable de entorno



export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, TOKEN_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(token);
        });
    })
    
}


//gateway websockeet