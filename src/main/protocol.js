import { protocol } from "electron";
import { URL } from "url";
import path from "path";

const PRODUCTION_APP_PROTOCOL = "amadeus";
// eslint-disable-next-line no-undef
const PRODUCTION_APP_PATH = path.join(__dirname, "..", "renderer");

protocol.registerSchemesAsPrivileged([
    { 
        scheme: PRODUCTION_APP_PROTOCOL, 
        privileges: { 
            secure: true, 
            standard: true 
        } 
    }
]);

export default {
    register: () => {
        protocol.registerFileProtocol(PRODUCTION_APP_PROTOCOL, (request, callback) => {
            const url = new URL(request.url).pathname;
            const normalized = path.normalize(url);
            const protocol = path.join(PRODUCTION_APP_PATH, normalized);
            return callback({ path: protocol });
        });
    }
};