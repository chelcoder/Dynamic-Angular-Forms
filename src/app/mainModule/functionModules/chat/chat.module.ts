import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { DataGridModule } from "primeng/datagrid";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { DataTableModule } from "angular-6-datatable";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgDatepickerModule } from "ng2-datepicker";
import { HttpClientModule } from "@angular/common/http";
import { ChatComponent } from "./chat.component";
import { ChatService } from "../../../_services/chat.service";
import { UserService } from 'src/app/_services/user.service';
const routes: Routes = [
    {
        path: "",
        component: ChatComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
       
        NgbModule,

        //for new data table

        FormsModule,
        // DataTableModule,
        
        DataTableModule,
        DataGridModule,
        SweetAlert2Module.forRoot(),
        NgDatepickerModule,
        HttpClientModule
    ],
    exports: [RouterModule],
    declarations: [ChatComponent],
    providers: [UserService, ChatService]
})
export class ChatModule { }
