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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
