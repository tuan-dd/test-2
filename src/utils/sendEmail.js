"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("@/config/config"));
const { clientId, clientSecret, refreshToken, redirectUrl, email_from } = config_1.default.email;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUrl);
oAuth2Client.setCredentials({ refresh_token: refreshToken });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendMail = async (sixCode, email) => {
    const accessToken = (await oAuth2Client.getAccessToken());
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: email_from,
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            accessToken: accessToken,
        },
    });
    return transporter.sendMail({
        from: config_1.default.email.email_from,
        to: `${email}`,
        subject: 'Hello ✔',
        text: ` Hello ${email} `,
        html: `<b>${sixCode}</b>`,
    }, (err, info) => {
        if (err)
            return err;
        return info;
    });
};
exports.sendMail = sendMail;
