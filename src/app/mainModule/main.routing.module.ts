import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";
import { MainComponent } from './main.component';

const routes: Routes = [
    {
        "path": "",
        "component": MainComponent,
        "canActivate": [AuthGuard],
        "canActivateChild": [ AuthGuard ],
        "children": [
            {
                "path": "index",
                "loadChildren": ".\/crudModules\/user\/user.module#UserModule"
            },{
                "path": "user",
                "loadChildren": ".\/crudModules\/user\/user.module#UserModule"
            },
            {
                "path": "profile",
                "loadChildren": ".\/crudModules\/profile\/profile.module#ProfileModule"
            },
            {
                "path": "change-password",
                "loadChildren": ".\/crudModules\/change-password\/change-password.module#ChangePasswordModule",

            },
            {
                "path": "",
                "redirectTo": "index",
                "pathMatch": "full"
            },



        ]
    },

    {
        "path": "**",
        "redirectTo": "404",
        "pathMatch": "full"
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})
export class MainRoutingModule { }
