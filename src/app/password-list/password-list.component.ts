import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';

import { AES, enc } from 'crypto-js';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.css']
})
export class PasswordListComponent {
  
  siteId !: string;
  siteName !: string;
  siteURL !: string;
  siteImgUrl !: string;

  passwordList !: Array <any>;

  email !:string;
  username !:string;
  password !:string;
  passwordId !:string;

  formState : string = 'Add New';

  isSuccess: boolean = false;
  successMessage !: string;

  constructor(private route: ActivatedRoute, private passwordManagerService: PasswordManagerService){
    this.route.queryParams.subscribe((val:any) => {
      this.siteId = val.id;
      this.siteName = val.siteName;
      this.siteURL = val.siteURL;
      this.siteImgUrl = val.siteImgUrl;
    });

    this.loadPasswords(); 

  }

  showAlert(message: string){
    this.isSuccess = true;
    this.successMessage = message;
  }

  resetForm(){
    this.email = '';
    this.username = '';
    this.password = '';
    this.passwordId = '';
    this.formState= 'Add New';
  }

  onsubmit(values: any){

    const encryptedPassword = this.encrytpPassword(values.password);
    values.password = encryptedPassword;

    if(this.formState == 'Add New'){
      this.passwordManagerService.addPassword(values, this.siteId)
    .then(()=>{
      this.showAlert("Data Saved Succesfully")
      this.resetForm();
    })
    .catch(err=>{
      console.log(err);
    })
    }
    else if(this.formState == 'Edit'){
      this.passwordManagerService.updatePassword(this.siteId, this.passwordId, values)
      .then(()=>{
        this.showAlert("Data Updated Succesfully")
        this.resetForm();
      })
      .catch(err=>{
        console.log(err);
      })
    }

    
  }

  loadPasswords(){
     this.passwordManagerService.loadPasswords(this.siteId).subscribe(val=>{
      this.passwordList = val;
     })
  }

  editPassword(email: string, username: string, password: string, passwordId: string){
    this.email = email;
    this.username = username;
    this.password = password;
    this.passwordId = passwordId;

    this.formState = 'Edit';
  }

  deletePassword(passwordId: string){
    this.passwordManagerService.deletePassword(this.siteId, passwordId)
    .then(()=>{
      this.showAlert("Data Deleted Succesfully")
    })
    .catch(err=>{
      console.log(err);
    })
  }

  encrytpPassword(password: string){
    const secretKey = 'gxtwSFCTv2kIRCNvd1K1wWQwhjdw5oVw';
    const encryptedPassword = AES.encrypt(password, secretKey).toString();
    return encryptedPassword;
  }

  decryptPassword(password: string){
    const secretKey = 'gxtwSFCTv2kIRCNvd1K1wWQwhjdw5oVw';
    const decryptPassword = AES.decrypt(password, secretKey).toString(enc.Utf8);
    return decryptPassword;
  }

  onDecrypt(password: string, index: number){
    const decPassword = this.decryptPassword(password);
    this.passwordList[index].password = decPassword;
  }

}
