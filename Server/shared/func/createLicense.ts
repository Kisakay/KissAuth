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

import { Database } from "../database.js";

export async function CreateLicense(key: string, ip: string) {
    const license_table = Database.table("license");
    const isExist = await license_table.get(`key.${key}`) !== undefined;

    if (isExist) {
        return {
            error: "Key already exists"
        };
    }

    await license_table.set(`key.${key}`, ip);

    return {
        success: true
    };
}