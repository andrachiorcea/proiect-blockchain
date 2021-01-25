import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import User from '../shared/models/User';
import Roles from '../shared/Roles';
const Web3 = require('web3');

declare let require: any;
declare let window: any;
const tokenAbi = require('../../../../../truffle-project/build/contracts/Marketplace.json');

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  web3: any;
  enable: any;
  account: string;
  private accountChangedObserver = new BehaviorSubject<string>(null);
  marketPlaceContract: any;
  constructor() {
    if (window.ethereum === undefined) {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      this.web3 = new Web3.providers.HttpProvider('http://localhost:7545');

      console.log('transfer.service :: constructor :: window.ethereum');
      window.web3 = new Web3(this.web3);
      console.log('transfer.service :: constructor :: this.web3');
      console.log(this.web3);
      this.enable = this.enableMetaMaskAccount();

      const contract = require('@truffle/contract');
      this.marketPlaceContract = contract(tokenAbi);
      this.marketPlaceContract.setProvider(this.web3);
    }
  }

  getAccountChangedObserver() {
    return this.accountChangedObserver;
  }

  onAccountChanged(value: string) {
    this.accountChangedObserver.next(value);
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = window.ethereum.enable();
    });
    return Promise.resolve(enable);
  }

  public async getAccounts(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      console.log('transfer.service :: getAccount :: eth');
      console.log(window.web3.eth);
      window.web3.eth.getAccounts((err: null, accounts: string[]) => {
        console.log('transfer.service :: getAccount: retAccount');
        if (accounts.length > 0) {
          resolve(accounts);
        } else {
          reject([]);
        }
        if (err != null) {
          reject(['Error retrieving account']);
        }
      });
    }) as Promise<string[]>;
  }

  public async getUserInfo(account: string) {
    return new Promise((resolve, reject) => {
      this.marketPlaceContract
        .deployed()
        .then((instance) => {
          return instance.getUserInfo({
            from: account,
          });
        })
        .then((status) => {
          resolve(status);
        })
        .catch((error) => {
          console.log(error);
          return reject('transfer.service error');
        });
    }) as Promise<string>;
  }

  public async registerUser(user: User) {
    const role = user.role;
    return new Promise((resolve, reject) => {
      this.marketPlaceContract
        .deployed()
        .then((instance) => {
          if (role === Roles.Freelancer) {
            return instance.registerFreelancer(user.name, user.expertise, {
              from: user.address,
            });
          }
          if (role === Roles.Manager) {
            return instance.registerManager(user.name, {
              from: user.address,
            });
          }
          if (role === Roles.Freelancer) {
            return instance.registerEvaluator(user.name, user.expertise, {
              from: user.address,
            });
          }
        })
        .then((status) => {
          resolve(status);
        })
        .catch((error) => {
          console.log(error);
          return reject('transfer.service error');
        });
    }) as Promise<string>;
  }
}
