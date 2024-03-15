import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SleeperfixComponent } from './sleeperfix/view/sleeperfix/sleeperfix.component';


@NgModule({
  imports: [RouterModule.forRoot(
    [{
      path: '', component: SleeperfixComponent
    }]
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
