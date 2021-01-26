import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import CreateProject from 'src/app/shared/models/CreateProject';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  account: string | undefined;
  role: string;
  createProjectGroup = new FormGroup({
    description: new FormControl(''),
    devCost: new FormControl(0),
    revCost: new FormControl(0),
    expertise: new FormControl(''),
  });
  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.getAccounts().then((data) => {
      this.account = data[0];
      this.accountService.getUserInfo(this.account).then((data) => {
        this.role = data;
      });
    });

    this.accountService.getAccountChangedObserver().subscribe((newAccount) => {
      this.account = newAccount;
      this.accountService.getUserInfo(this.account).then((data) => {
        this.role = data;
      });
    });
  }

  onSubmit() {
    // Make sure to create a deep copy of the form-model
    const project: CreateProject = Object.assign(
      {},
      this.createProjectGroup.value
    );
    project.ownerAddress = this.account;

    this.accountService.createProject(project).then((data) => {
      console.log('register successfully');
    });
  }
}
