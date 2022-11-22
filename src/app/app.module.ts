import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfoComponent } from './info/info.component';
import { CentralSectionComponent } from './central-section/central-section.component';
import { MoveInfoComponent } from './central-section/move-info/move-info.component';
import { BoardComponent } from './central-section/board/board.component';
import { GuessBarComponent } from './central-section/guess-bar/guess-bar.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { ScoreComponent } from './score/score.component';
import { ReviewConcludedComponent } from './review-concluded/review-concluded.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    CentralSectionComponent,
    MoveInfoComponent,
    BoardComponent,
    GuessBarComponent,
    WelcomeComponent,
    IntroductionComponent,
    ScoreComponent,
    ReviewConcludedComponent,
    ConfirmationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClipboardModule,
    FontAwesomeModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
