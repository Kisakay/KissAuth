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

export async function CheckLicense(key: string, ip?: string) {
    const license_table = Database.table("license");
    const license_data = await license_table.get(`key.${key}`);
    const isExist = license_data !== undefined;

    if (!isExist) {
        return {
            error: "Key don't exist"
        };
    }

    // Check if the ip is the same
    if (ip && license_data.ip !== ip) {
        return {
            error: "Bad ip with your key !"
        };
    }

    return {
        success: true,
        ip: license_data.ip,
        key: license_data.key
    };
}