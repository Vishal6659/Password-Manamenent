import { Component } from '@angular/core';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent {

  allSites !: Observable<Array<any>>;

  siteName !: string;
  siteUrl !: string;
  siteImgUrl !: string;
  siteId !: string;

  formState: string = "Add New";

  isSuccess: boolean = false;
  successMessage !: string;

  constructor(private passwordManagerService: PasswordManagerService){
    this.loadSites();
  }

  showAlert(message: string){
    this.isSuccess = true;
    this.successMessage = message;
  }

  onSubmit(values: object){
    if(this.formState == "Add New"){
      this.passwordManagerService.addSite(values)
    .then(()=>{
      this.showAlert('Data Saved Succesfully');
    })
    .catch(err=>{
      console.log(err);
    })
    } 
    else if(this.formState = "Edit"){
      this.passwordManagerService.updateSite(this.siteId, values)
      .then(()=>{
        this.showAlert('Data Edit Succesfully');
      })
      .catch(err=>{
        console.log(err);
      })
    }     
  }

  loadSites(){
   this.allSites =  this.passwordManagerService.loadSites();
  }

  editSite(siteName: string, siteUrl: string, siteImgUrl: string, id: string){
    this.siteName = siteName;
    this.siteUrl = siteUrl;
    this.siteImgUrl = siteImgUrl;
    this.siteId = id;
    this.formState = "Edit";
  }

  deleteSite(id:string){
    this.passwordManagerService.deleteSite(id)
    .then(()=>{
      this.showAlert('Data Deleted Succesfully');
    })
    .catch(err=>{
      console.log(err);
    })
  }



}
