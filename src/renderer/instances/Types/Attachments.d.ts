import {
    BaseLink,
    PhotosPhoto,
    StoriesStory,
    VideoVideoFull1,
    VideoVideo,
    PollsPoll,
    PollsAnswer,
    PollsBackground,
    BaseGeoCoordinates
} from "vk-io/lib/api/schemas/objects";

export type TSize = {
    max: string
    medium: string
    min: string
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

export type TMap = {
    id: number
    coordinates: BaseGeoCoordinates
    place: any
};