import * as express from 'express';
import * as http from 'http';
import * as debug from "debug";

export class HttpHandler {
    private server: http.Server;
    private logger: debug.IDebugger;

    private readonly port: string = process.env.PORT || '8080';
    private readonly root: string = 'webroot';

    constructor() {
        this.logger = debug('http');

        let middleWare: express.Express = express()
        middleWare.use((req: http.ServerRequest, res: http.ServerResponse, next: express.NextFunction) => {
            this.logger(req.url);
            next();
        });
        middleWare.use(express.static(this.root));

        this.server = http.createServer(middleWare);
        this.server.listen(this.port, () => this.logger(`Listening on ${ this.port }`));
    }

    public getServer() {
        return this.server;
    }
}