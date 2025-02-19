/*

▗▖ ▗▖▄  ▄▄▄  ▄▄▄  ▗▄▖ █  ▐▌   ■  ▐▌   
▐▌▗▞▘▄ ▀▄▄  ▀▄▄  ▐▌ ▐▌▀▄▄▞▘▗▄▟▙▄▖▐▌   
▐▛▚▖ █ ▄▄▄▀ ▄▄▄▀ ▐▛▀▜▌       ▐▌  ▐▛▀▚▖
▐▌ ▐▌█           ▐▌ ▐▌       ▐▌  ▐▌ ▐▌
                             ▐▌       
    ・ Project under MIT License
    ・ Made by: @Kisakay
    ・ Repository: https://github.com/Kisakay/KissAuth
*/

import rateLimit from "express-rate-limit";
import express from 'express';

import { config } from '../config.js';
import { printer } from "../index.js";

import path from "path";
import fs from "fs";
import { ServerRoute } from "../types/ServerRoute.js";

class Server {
    app: express.Express;

    constructor() {
        printer.legacy("[".gray + "SERVER".blue + "]".gray + " KissAuth Server side starting...");

        this.app = express();
        this.setup();
    }

    private async setup() {
        await this.init();
        await this.routes_handler();
        await this.listen();
    }

    private async init() {
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 25,
            standardHeaders: true
        });

        this.app.use(limiter);
        this.app.use(express.json({ limit: "500mb" }));

        this.app.post('/api/json', (req, res) => {
            // server(req, res, db);
        });
    }

    private async routes_handler() {
        const routesDir = path.join(process.cwd(), "dist/api/routes");
        const routesFolder = fs.readdirSync(routesDir);

        for (const category of routesFolder) {
            const categoryPath = path.join(routesDir, category);

            if (!fs.lstatSync(categoryPath).isDirectory()) {
                continue;
            }

            const categoryFolder = fs.readdirSync(categoryPath);

            categoryFolder.filter(file => file.endsWith('.js'));

            for (const file of categoryFolder) {
                const routePath = path.join(categoryPath, file);
                const { routes: _routes } = await import(routePath);

                if (!_routes) continue;

                if ('path' in _routes && 'method' in _routes && 'evaluate' in _routes) {
                    const route = _routes as ServerRoute;

                    this.app[route.method](route.path, route.evaluate);
                }
            }
        }
    }

    private listen(): Promise<express.Application> {
        return new Promise((resolve, reject) => {
            this.app.listen(config.server.server_port, () => {
                printer.legacy("[".green + "SERVER".blue + "]".green + " KissAuth Server side started on port " + config.server.server_port);
                resolve(this.app);
            });
        });
    }

    public getApp(): express.Express {
        return this.app;
    }
}

export {
    Server
};