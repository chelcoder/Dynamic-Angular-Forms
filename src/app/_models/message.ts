export interface IChatMessage {
    id?: string;
    message?: string;
    time?: Date;
    admin?: boolean;
}

export class ChatMessage implements IChatMessage {
    $key?: string;
    message?: string;
    time?: Date;
    admin?: boolean;
    constructor(data: IChatMessage) {
        this.$key = data.id;
        this.message = data.message;
        this.time = data.time;
        this.admin = data.admin;

    }
}
