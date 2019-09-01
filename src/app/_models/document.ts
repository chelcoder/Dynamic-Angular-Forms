export interface IDocument {
    id?: string;
    name?: string;
    type?: string;
    url?: string;
    size?: number;
    imgName?: string;
    category?:string;
}

export class Document {
    $key?: string;
    name?: string;
    url?: string;
    imgName?: string;
    type?: string;
    size?: number;
    category?:string;
    constructor(data: IDocument,id?:any) {
        this.$key = data.id;
        this.name = data.name;
        this.type = data.type.substr(0, data.type.indexOf('/'));
        this.size = data.size;
        this.url = data.url;
        this.imgName = data.imgName;
        this.category = data.category;
    }
}

