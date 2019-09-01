export interface IClient {
    Role?: string;
    client?: string
    emailAddress?:string;
}
export class Client implements IClient {
    id?: string;
    Role?: string;
    client?: string
    emailAddress?:string;

    constructor(data: IClient, id?) {
        this.id = id;
        this.Role = data.Role;
        this.client = data.client
        this.emailAddress = data.emailAddress
    }

}