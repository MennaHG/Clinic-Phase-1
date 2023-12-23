import { environment } from "src/environments/environment.prod";
/*/// <reference types="node" />

    let port = process.env['flaskPort'] || 5000;
  export const API_URL=`http://localhost:${port}`;*/

let port = environment.flaskPort; console.log(port);
export const API_URL = `http://localhost:${port}`;