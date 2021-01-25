import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
const Web3 = require('web3');

declare let require: any;
declare let window: any;
const tokenAbi = require('../../../../../truffle-project/build/contracts/Marketplace.json');

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  web3: any;
  enable: any;
  account: string;
  private accountChangedObserver = new BehaviorSubject<string>(null);

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
    console.log('transfer.service :: getAccount :: start');
    let getAccount = await new Promise((resolve, reject) => {
      console.log('transfer.service :: getAccount :: eth');
      console.log(window.web3.eth);
      window.web3.eth.getAccounts((err: null, accounts: string | any[]) => {
        console.log('transfer.service :: getAccount: retAccount');
        console.log(accounts);
        if (accounts.length > 0) {
          resolve(accounts);
        } else {
          reject([]);
        }
        if (err != null) {
          reject(['Error retrieving account']);
        }
      });
    }) as unknown as Promise<string[]>;

    return Promise.resolve(getAccount);
  }


  public async getUserInfo(account: string) {
    const that = this;
    return new Promise((resolve, reject) => {
      console.log('transfer.service :: transferEther :: tokenAbi');
      console.log(tokenAbi);
      const contract = require('@truffle/contract');
      const marketPlaceContract = contract(tokenAbi);
      marketPlaceContract.setProvider(that.web3);
      console.log('transfer.service :: transferEther :: transferContract');
      console.log(marketPlaceContract);
      marketPlaceContract.deployed().then(function(instance) {
        return instance.getUserInfo(
          {
            from: account
          });
      }).then(function(status) {
        resolve(status);
      }).catch(function(error) {
        console.log(error);
        return reject('transfer.service error');
      });
    }) as Promise<string>;
  }
}
