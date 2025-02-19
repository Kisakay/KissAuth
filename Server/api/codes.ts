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

export const codes = {
    200: {
        code: 200,
        title: "Success",
        description: "The request has succeeded."
    },
    400: {
        code: 400,
        title: "Bad Request",
        error: "The request could not be understood by the server due to malformed syntax."
    },
    already: {
        code: 400,
        title: "Bad Request",
        error: "The key already exists."
    },
    403: {
        code: 403,
        title: "Forbidden",
        error: "The server understood the request, but is refusing to fulfill it."
    },
}