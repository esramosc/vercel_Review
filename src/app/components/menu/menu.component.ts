import { Router } from '@angular/router';
import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

@HostListener('document:fullscreenchange', ['$event'])
@HostListener('document:webkitfullscreenchange', ['$event'])
@HostListener('document:mozfullscreenchange', ['$event'])
@HostListener('document:MSFullscreenChange', ['$event'])

export class MenuComponent implements OnInit {

  branch: any;
  user: any;
  gymOwner = 3;
  branchAdmin = 4;
  canChangeBranch = false;
  random = Math.random();
  elem: any;
  isFullScreen = false;

  constructor(
    private storage: Storage,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {
    this.storage.get('current_branch').then((branch) => {
      this.branch = branch ;
    });
    this.storage.get('user').then(user => {
      this.user = user;
      if (this.user.rol.id === this.gymOwner ||
        this.user.rol.id === this.branchAdmin) {
          this.canChangeBranch = true;
        }
    });
  }

  ngOnInit() {
    this.chkScreenMode();
    this.elem = document.documentElement;
  }

  changeBranch() {
    this.random = Math.random();
    this.router.navigateByUrl('/change-branch');
  }

  logout() {
    this.storage.remove('token');
    this.storage.remove('user');
    this.storage.remove('branches');
    this.storage.remove('current_branch');
    this.router.navigate(['/login']);
  }

  openFullScreen() {
    this.isFullScreen = true;
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  closeFullScreen() {
    this.isFullScreen = false;
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  fullscreenmodes(event) {
    this.chkScreenMode();
  }

  chkScreenMode() {
    if (document.fullscreenElement) {
      // fullscreen
      this.isFullScreen = true;
    } else {
      // not in full screen
      this.isFullScreen = false;
    }
  }

}
