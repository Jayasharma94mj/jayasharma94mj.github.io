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
  title = 'welcome to chat bot';
  showTheUt = ''
  initialValue: boolean = false;
  userForm: FormGroup;
  userInput : string[] = [];
  dataFromServer = []
  isLoading: boolean = false
  constructor(private fb: FormBuilder, private load: AppService) {
    this.userForm = this.fb.group({
      userinput: [, Validators.required]
    });
  }

   submitForm() {
    console.log('Form Submitted with value: ', this.userForm.value);
      this.userInput.push(this.userForm.get('userinput')?.value)

      this.load.runTests().subscribe(async(response) =>{
        console.log('response is', response.output);

        //call the method without package
        this.load.LoadOpenAidata(response.output).subscribe((data)=>{
          console.log("data is", data)
        })

        //Call the method with package
        const responsedata = await this.load.getResponse(response.output)
        console.log("data from package", responsedata);
      })
    }

    clickWithoutPackage = (): void => {  
      this.showTheUt = ""
      this.load.runTests().subscribe((response) =>{
        this.isLoading = true
        console.log('response is', response.output);

        //call the method without package
        this.load.LoadOpenAidata(response.output).subscribe((data)=>{
          this.isLoading = false
          console.log("data is", data.choices[0].message.content)
          this.showTheUt = data.choices[0].message.content         
        })
      })
    }
    clickWithPackage = (): void => { 
      this.showTheUt = ""
      this.load.runTests().subscribe(async(response) =>{
        this.isLoading = true
        console.log('response is', response.output);
        //Call the method with package
        const responsedata = await this.load.getResponse(response.output)
        console.log("data from package", responsedata.choices[0].message.content);
        this.isLoading = false
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
  }

  
  
  
  
  
    
    


