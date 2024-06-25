import { Collection } from "pwss";

declare module 'pwss' {
    export interface Client {
        commands: Collection<string, any>,
    }
};