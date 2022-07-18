import { PollsBackground } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";

import IPreview from "~/instances/Interfaces/Preview";
import { TPoll, TPollChoice, TPollStyle, TSize } from "~/instances/Types/Attachments";

class Poll extends Attachment implements IPreview {
    public sizes?: TSize;

    public owner_id: number;
    public id: number;
    public multiple: number | boolean;
    public answer_ids: number[];
    public created: number;
    public question: string;
    public votes: number;
    public is_board: number | boolean;
    public answers: TPollChoice[];
    public isPhoto: boolean;

    private _background: PollsBackground;
    private _end_date: number;
    private _closed: number | boolean;
    private _can_vote: number | boolean;

    constructor(poll: TPoll) {
        super(poll, "poll");

        this.owner_id = poll.owner_id;
        this.id = poll.id;
        this.multiple = poll.multiple;
        this.answer_ids = poll.answer_ids || [];
        this.created = poll.created;
        this.question = poll.question;
        this.votes = poll.votes;
        this.is_board = poll.is_board;

        this.answers = poll.answers.map(answer => ({
            ...answer,
            choiced: this.answer_ids.includes(answer.id)
        }));

        this._end_date = poll.end_date;
        this._closed = poll.closed;
        this._can_vote = poll.can_vote
            && this.answers.every(answer => !answer.choiced);

        this.isPhoto = "photo" in poll;

        if (this.isPhoto) {
            this.sizes = this.calculateSize(poll.photo.images);
            this._background = poll.photo;
        } else this._background = poll.background;
    }

    choice(answer: TPollChoice): boolean {
        answer.choiced = !answer.choiced;
        return this.voteAvailable
                && Boolean(this.multiple);
    }

    vote(answer: TPollChoice): boolean { 
        if (this.choice(answer)) {
            this.votes++;
            this._can_vote = false;
            return true;
        }
        
        return false;
    }

    get voteAvailable(): boolean {
        return this._can_vote
            && !this._closed
            && (this._end_date > 0
                ? new Date() < new Date(this._end_date * 1000)
                : true);
    }

    get readyToVote(): boolean {
        if (!this.voteAvailable) {
            return false;
        }

        if (this.multiple) {
            return this.choiced.length > 0 
                || (this.choiced.length === 0 && this.votes > 0);
        }

        return false;
    }

    get choiced(): TPollChoice[] {
        return this.answers.filter(answer => {
            return answer.choiced;
        });
    }

    get style(): TPollStyle {
        if (this.isPhoto) {
            return {
                poll: {
                    backgroundImage: `url("${this.sizes.max}")`
                },
    
                foreground: {
                    background: `linear-gradient(
                        transparent -100%,
                        #${this._background.color} 100%
                    )`
                }
            };
        }

        return {
            poll: {},

            foreground: {
                background: `linear-gradient(
                    ${this._background.angle}deg, 
                    #${this._background.points[0].color} 0%, 
                    #${this._background.points[1].color} 100%
                )`
            }
        };
    }
}

export default Poll;