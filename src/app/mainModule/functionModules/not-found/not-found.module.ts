import { NotFoundComponent } from "./not-found.component";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { GenericModule } from "../../generic/generic.module";

const routes: Routes = [
    {
        path: "",
        component:NotFoundComponent
    }
];


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbModule,
        GenericModule,
    ],
    exports: [RouterModule],
    declarations: [NotFoundComponent],
})
export class NotFoundModule{}