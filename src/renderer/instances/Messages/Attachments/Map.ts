import { BaseGeoCoordinates } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";

import { TMap } from "~/instances/Types/Attachments";

class Map extends Attachment implements TMap {
    public coordinates: BaseGeoCoordinates;
    public place: any;

    constructor(geo: TMap) {
        super({
            ...geo,
            id: geo.coordinates.latitude // его идеи будут актуальны
        }, "geo");

        this.coordinates = geo.coordinates;
        this.place = geo.place;
    }

    get title() {
        return this.place.title;
    }
}

export default Map;