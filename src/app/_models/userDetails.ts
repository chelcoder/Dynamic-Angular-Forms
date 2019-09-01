export interface IUserDetails {

    client?: string;

}
export class UserDetails implements IUserDetails {
    id?:string;
    client?: string;
    constructor(data: IUserDetails, client?,id?) {
        this.id = id;
        this.client = data.client;
    }

}
