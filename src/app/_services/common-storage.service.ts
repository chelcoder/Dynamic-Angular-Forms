
import { Injectable } from "@angular/core";

@Injectable()
export class CommonStorageService {


    private _selectedValueIndex: number;


    private _listData: any;

    private _pagesLoaded: boolean;


    get selectedValueIndex(): number {
        return this._selectedValueIndex;
    }

    set selectedValueIndex(value: number) {
        this._selectedValueIndex = value;
    }

    get listData(): any {
        return this._listData;
    }

    set listData(value: any) {
        this._listData = value;
    }

    get pagesLoaded(): boolean {
        return this._pagesLoaded;
    }

    set pagesLoaded(value: boolean) {
        this._pagesLoaded = value;
    }


}