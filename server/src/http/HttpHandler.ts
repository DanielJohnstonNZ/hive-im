import * as express from "express";
import * as http from "http";
import * as debug from "debug";
import * as path from "path";

const LogHttp = (data: any) => debug("http")(data);

export class HttpHandler {
  private server: http.Server;

  private readonly port: string = process.env.PORT || "8080";
  private readonly root: string = path.resolve(__dirname, "../../../webroot");

  constructor() {
    let middleWare: express.Express = express();
    middleWare.use(
      (
        req: http.ServerRequest,
        res: http.ServerResponse,
        next: express.NextFunction
      ) => {
        LogHttp(req.url);
        next();
      }
    );
    middleWare.use(express.static(this.root));

    this.server = http.createServer(middleWare);
    this.server.listen(this.port, () => {
      LogHttp(`Listening on ${this.port}`);
      LogHttp(`Webroot at ${this.root}`);
    });
  }

  public getServer(): http.Server {
    return this.server;
  }
}
