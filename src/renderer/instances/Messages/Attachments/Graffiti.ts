import { MessagesGraffiti } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";

class Graffiti extends Attachment {
    public url: string;

    constructor(graffiti: MessagesGraffiti) {
        super(graffiti, "graffiti");
        this.url = graffiti.url;
    }
}

export default Graffiti;