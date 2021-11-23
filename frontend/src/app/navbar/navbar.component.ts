import { ThrowStmt } from '@angular/compiler';
import { Component, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import User from '../models/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() logoutEvent = new EventEmitter<string>();

  public innerWidth: any;
  public mustShow:boolean = false;

  constructor() { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  } 

  @HostListener('window:resize', ['$event'])
  onResize(event:any){
    this.innerWidth = window.innerWidth;
  }

  showHideNavbar(){
    this.mustShow = !(this.mustShow);
  }

  logout(){
    this.logoutEvent.emit('');
  }
}
