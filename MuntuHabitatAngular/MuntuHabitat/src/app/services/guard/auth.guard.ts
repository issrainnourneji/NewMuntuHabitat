import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { TokenService } from "../token/token.service";



export const userGuard: CanActivateFn = (route, state) => {
  if (inject(TokenService).isAuthenticated()) {
    return true;
  }else{
    inject(Router).navigate(['/login'])
    return false;
  }
};

export const clientGuard: CanActivateFn = (route, state) => {
  if (inject(TokenService).isClient()) {
    return true;
  }else{
    inject(Router).navigate(['/login'])
    return false;
  }
};


export const adminGuard: CanActivateFn = (route, state) => {
  if (inject(TokenService).isAdmin()) {
    return true;
  }else{
    inject(Router).navigate(['/login'])
    return false;
  }
};

export const agentGuard: CanActivateFn = (route, state) => {
  if (inject(TokenService).isAgent()) {
    return true;
  }else{
    inject(Router).navigate(['/login'])
    return false;
  }
};
