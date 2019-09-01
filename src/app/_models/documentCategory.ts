export interface IDocumentCategory {
    id?: string;
    name?: string;
    type?: string;
    url?: string;
    size?: number;
    category?:string;
    fileName?:string;
}

export class DocumentCategory {
    docId?: string;
    fileName?:string;
    file?:File
    name?: string;
    url?: string;
    type?: string;
    size?: number;
    category?:string;

    constructor(data: IDocumentCategory,category?:string,name?:any) {
        this.name = data.name;
        this.type = data.type.substr(0, data.type.indexOf('/'));
        this.size = data.size;
        this.url = data.url;
        this.category = data.category;
        this.fileName = data.fileName;
    }
}

