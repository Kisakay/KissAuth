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

export async function DeleteLicense(key: string) {
    const license_table = Database.table("license");
    const license_data = await license_table.get(`key.${key}`);
    const isExist = license_data !== undefined;

    if (!isExist) {
        return {
            error: "Key doesn't exist"
        };
    }

    await license_table.delete(`key.${key}`);

    return {
        success: true,
        ip: license_data.ip
    };
}