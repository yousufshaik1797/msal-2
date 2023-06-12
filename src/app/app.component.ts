import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventType } from '@azure/msal-browser';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit , OnDestroy{
  title = 'msal';
  activeUser:string|undefined="unknown user";
  isAuthenticated = false;
  private unsubscribe = new Subject<void>();
  constructor(private msalervice:MsalService,private msalBroadcastService:MsalBroadcastService){}

  login(){
    this.msalervice.instance.loginRedirect({
      scopes:["user.Read"]
    })
  }

  logout(){
    this.msalervice.instance.logoutRedirect();
  }

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$.pipe(filter((status:InteractionStatus)=>status === InteractionStatus.None),
    takeUntil(this.unsubscribe)
    ).subscribe(()=>{
      this.setAuthenticationStatus();
    })

    this.msalBroadcastService.msalSubject$
    .pipe(
      filter((message:EventMessage)=> message.eventType === EventType.LOGIN_SUCCESS),
      takeUntil(this.unsubscribe)
      )
      .subscribe((message:EventMessage)=>{
      const authResult=message.payload as AuthenticationResult;
      this.msalervice.instance.setActiveAccount(authResult.account);
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(undefined);
    this.unsubscribe.complete();
  }

  setAuthenticationStatus():void {
    let activeAccount = this.msalervice.instance.getActiveAccount();
    if(!activeAccount && this.msalervice.instance.getAllAccounts().length>0){
      activeAccount = this.msalervice.instance.getAllAccounts()[0];
      this.msalervice.instance.setActiveAccount(activeAccount);
    }
    this.isAuthenticated=!!activeAccount;
    this.activeUser=activeAccount?.username;
  }

}
