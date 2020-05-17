import {BrowserModule, HammerGestureConfig,HAMMER_GESTURE_CONFIG} from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { FileUploadModule } from 'ng2-file-upload';
import { NgxGalleryModule } from "@kolkov/ngx-gallery";


import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BsDropdownModule, TabsModule, PaginationModule, ButtonsModule} from "ngx-bootstrap";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { AppComponent } from "./app.component";
import { NavComponent } from "./nav/nav.component";
import { UserService } from "./_services/user.service";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { ListsComponent } from "./lists/lists.component";
import { MessagesComponent } from "./messages/messages.component";
// import { ValueComponent } from './value/value.component';

import { MemberListComponent } from "./members/member-list/member-list.component";
import { MemberCardComponent } from "./members/member-card/member-card.component";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";

import { MemberDetailResolver } from "./_resolvers/member-detail.resolver";
import { MemberEditResolver } from "./_resolvers/member-edit.resolver";
import { MemberListResolver } from "./_resolvers/member-list.resolver";
import { ListsResolver } from './_resolvers/lists.resolver';

import { AuthService } from "./_services/auth.service";
import { appRoutes } from "./routes";
import { JwtModule } from "@auth0/angular-jwt";
import { AlertifyService } from "./_services/alertify.service";
import { AuthGuard } from "./_guards/auth.guard";
// import { NgxGalleryModule } from "@nomadreservations/ngx-gallery";

import { PreventUnsavedChanges } from "./_guards/prevent-unsaved-changes.guard";
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { TimeagoModule } from 'ngx-timeago';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';

// import { TimeAgoPipe } from 'time-ago-pipe';

export function tokenGetter() {
  return localStorage.getItem("token");
}

export class CustomHammerConfig extends HammerGestureConfig {
  ovverides = {
    pinch: { enable: false },
    rotate: { enable: false }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    MemberMessagesComponent
    // TimeAgoPipe
    
  ],
  imports: [
    BrowserModule,
    TimeagoModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    FileUploadModule,
    ButtonsModule,
    NgxGalleryModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:5000"],
        blacklistedRoutes: ["localhost:500/api/auth"]
      }
    })
  ],

  providers: [
    AuthService,
    UserService,
    AlertifyService,
    AuthGuard,
    UserService,
    MemberListResolver,
    MemberDetailResolver,
    MemberEditResolver,
    ListsResolver,
    PreventUnsavedChanges,
    MessagesResolver,
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule {}
