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

const config = {
    guild_id: "661161030610063",
    channel_id: "861615615155532",
    channel_log_id: "",
    
    bot: {
        bot_token: "The bot Token",
        bot_password: "The bot password used in the command",
    },

    permission: {
        white_list: [

            "Owner's ID One", "Owner's ID Two"

        ],
    },

    server: {
        server_url: "",
        server_port: 3030,
        server_authorizations: "The password",
    },
};

export { config };