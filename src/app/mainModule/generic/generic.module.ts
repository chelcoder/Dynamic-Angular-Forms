import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { SideNavComponent } from "./sidenav/sidenav.component";
import { RouterModule } from '@angular/router';
import { CrudComponent } from "../crudModules/crud.component";
import {GlobalsService} from "../../_services/globals.service";
import { UserService } from "../../_services/user.service";
import { xModalModule } from "./xModal/xModal.module";
import {CommonModule} from "@angular/common";
import { clientService } from "../../_services/clients.service";
import { SvgLineModule, SvgPolygonModule, SvgTextModule, SvgPathModule} from "angular-svg";
import { FormsModule } from '@angular/forms';
@NgModule({
    declarations: [
        HeaderComponent,
        SideNavComponent,
        CrudComponent,
    ],
    imports: [
        RouterModule,
        xModalModule,
        CommonModule,
        FormsModule
    ],
    exports :[
        HeaderComponent,
        SideNavComponent,
        CrudComponent,
        xModalModule,
    ],
    providers: [GlobalsService,UserService,clientService],
    bootstrap: []
})
export class GenericModule { }
