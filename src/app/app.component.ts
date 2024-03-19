import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SampleComponent } from './sample/sample.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterModule, CommonModule, SampleComponent, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [AppService],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Lets Help you to Find out missing uts';
  showTheUt = ''
  initialValue: boolean = false;
  userForm: FormGroup;
  userInput : string[] = [];
  dataFromServer = []
  isLoading: boolean = false
  showutdata: boolean = false
  missingUnitTest = 0
  totalUnittest = 0
  constructor(private fb: FormBuilder, private load: AppService) {
    this.userForm = this.fb.group({
      userinput: [, Validators.required]
    });
  }
    clickWithoutPackage = (): void => {  
      this.isLoading = true
      this.showTheUt = ""
      this.showutdata = false
      this.load.runTests().subscribe((response) =>{       
        console.log('response is', response.content);

        //call the method without package
        this.load.LoadOpenAidata(response.content).subscribe((data)=>{
          this.isLoading = false
          console.log("data is", data.choices[0].message.content)
          this.showutdata = true
          this.missingUnitTest = response.missingUnitTestCount
          this.totalUnittest = response.totalMethods
          this.showTheUt = data.choices[0].message.content  
          this.downloadFile(this.showTheUt, "Generated-Uts")       
        })
      })
    }

    clickWithPackage = (): void => {
      this.isLoading = true 
      this.showTheUt = ""
      this.showutdata = false
      this.load.runTests().subscribe(async(response) =>{
        console.log('response is', response.content);
        //Call the method with package
        const responsedata = await this.load.getResponse(response.content)
        console.log("data from package", responsedata.choices[0].message.content);
        this.isLoading = false
        this.showutdata = true
        this.missingUnitTest = response.missingUnitTestCount
        this.totalUnittest = response.totalMethods
        this.showTheUt =responsedata.choices[0].message.content
        
      })
    }
    
  gettitle = (): string => {
    return this.title
  }

  enableDisableButton = (): void => {
    if(!this.initialValue){
     this.initialValue =  true
    } else{
      this.initialValue =  false
    }
  }

  getboolean = (): boolean => {
    return this.initialValue
  }

  downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = '_blank';
    anchor.click();
  }
  }

  
  
  
  
  
    
    


