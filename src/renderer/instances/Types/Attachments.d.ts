import {
    BaseLink,
    PhotosPhoto,
    StoriesStory,
    VideoVideoFull1,
    VideoVideo,
    PollsPoll,
    PollsAnswer,
    PollsBackground,
    BaseGeoCoordinates,
    BaseUploadServer
} from "vk-io/lib/api/schemas/objects";
import { PhotosPhotoUploadResponse, VideoUploadResponse } from "vk-io/lib/api/schemas/responses";
import Attachment from "../Messages/Attachment";

export type TSize = {
    max: string
    medium: string
    min: string
};

export type TUploadData = {
    attachment: Attachment
    server?: BaseUploadServer
}

export type TSaveData = {
    server: () => any
    method: (upload: PhotosPhotoUploadResponse | VideoUploadResponse) => void
};

export type TUploadingPath = {
    extension: string
    path: string
};

export type TStory = StoriesStory & {
    video?: VideoVideoFull1 & VideoVideo
}

export type TLink = BaseLink & {
    photo?: PhotosPhoto
};

export type TPollChoice = PollsAnswer & {
    choiced: boolean
}

export type TPoll = PollsPoll & {
    answers: TPollChoice[],
    background: PollsBackground
};

export type TPollStyle = {
    poll: any
    foreground: any
}

export type TAudioPlaylist = {
    access_key?: string;
    count: number;
    description: string;
    id: number;
    owner_id: number;
    title: string;
    plays?: number;
    followers?: number;
    photo: any;
};

export type TMap = {
    id: number
    owner_id?: number
    coordinates: BaseGeoCoordinates
    place: any
};