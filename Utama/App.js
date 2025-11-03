const express = require('express');
const app =express();

app.get('/',(req,res) => {
    res.send("Welcome To Application")
});

app.listen(5000,()=>{
    console.log("listening to port 5000")
});
{
  "name": "project-monitoring",
  "version": "1.0.0",
  "description": "",
  "license": "ISC",
  "author": "Admin Fikry",
  "type": "commonjs",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}

{
  "name": "Project Monitoring",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {}
}
