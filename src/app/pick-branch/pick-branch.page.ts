import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pick-branch',
  templateUrl: './pick-branch.page.html',
  styleUrls: ['./pick-branch.page.scss'],
})
export class PickBranchPage implements OnInit {

  branches: any;
  selected_branch: any;
  dataResponse: any;

  constructor(
    private storage: Storage,
    private router: Router,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.storage.get('branches').then(branches => {
      this.branches = branches;
    });
  }

  save() {
    if (this.selected_branch !== undefined) {
      this.storage.get('user').then( user => {
        this.api.get(`sucursal/bygym/${user.id_gimnasio}`, {}).then(result => {
          this.dataResponse = result;
          const userBranch = this.dataResponse.data.find((b) => {
            return b.id === this.selected_branch.id;
          });
          const rand = Math.random();
          this.storage.set('current_branch', userBranch).then(() => {
            this.router.navigate(['/home', {id: rand}]);
          });
        });
      });
    }
  }

}
