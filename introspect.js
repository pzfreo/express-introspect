import querystring from 'querystring';
import axios from 'axios';

export default function (url, username, password) {
    const f = async function (req, res, next) { 
        const auth = req.headers.authorization;
        if (!auth) return res.status(401).send({ error: "bearer token not found"});

        const bearer = auth.trim().substr(6).trim() // remove "bearer"
    
        const data = { 
            token : bearer,
            token_type_hint : "access_token" 
        };
        const encoded = querystring.stringify(data);
    
        const response = await axios.post(url, encoded, { auth: {username: username, password: password}});
        
        if (!response.data.active) { 
            return res.status(401).send({ error: "unauthorized token"});
        } 
        if (response.data.username) {
            req.username = response.data.username;
        }
        next();
    };
    return f;
}