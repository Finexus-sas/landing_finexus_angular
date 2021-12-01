import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { AuthService } from "./services/auth.service";
import { Observable, of } from "rxjs";
import { tap, exhaustMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.auth
      .login({
        username: "portalfin",
        password: "uhkKB@#",
      })
      .pipe(
        tap((Response) => {
          this.auth.token = Response.data.token;
        }),
        exhaustMap(() => {
          return of(true);
        })
      );
  }
}
