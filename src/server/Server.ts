import express from 'express';

const server = express();

server.get(`/`, (req, res) =>{
    
    return res.send(`Um site de locação de quadras esportivas, por Ana Beatriz, Ana Julia, Carolaine e Gabriel`)
});

export {server};