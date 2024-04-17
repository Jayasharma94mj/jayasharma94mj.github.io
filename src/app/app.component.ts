import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SampleComponent } from './sample/sample.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterModule, CommonModule, SampleComponent, FormsModule, ReactiveFormsModule, HttpClientModule, NgChartsModule],
  providers: [AppService],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Lets Help you to Find out missing uts';
  showTheUt = ''
  initialValue: boolean = false;
  userForm: FormGroup;
  dataFromServer = []
  isLoading: boolean = false
  showutdata: boolean = false
  showUploadedFile: boolean = false;
  uploadedFile: string = ''
  missingUnitTest = 0
  totalUnittest = 0
  anchor: any
  showFooter: boolean = false
  public pieChartOptions = {
    responsive: false,
  };
  public pieChartLabels = [ 'Uncovered Uts', 'Covered Uts' ];
  public pieChartDatasets = [ {
    data: [ 7, 2 ],
  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  constructor(private fb: FormBuilder, public load: AppService) {
    this.userForm = this.fb.group({
      userinput: [, Validators.required]
    });
  }
  clickWithoutPackage = (): void => {
    this.isLoading = true
    this.showTheUt = ""
    this.showutdata = false
    this.load.runTests().subscribe((response) => {
      console.log('response is', response.content);

      //call the method without package
      this.load.LoadOpenAidata(response.content).subscribe((data) => {
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

  findUts = (): void => {
    this.isLoading = true
    this.load.runTests().subscribe((response) => {
      this.isLoading = false
      console.log('response is', response.content);
      this.showutdata = true
      this.missingUnitTest = response.missingUnitTestCount
      this.totalUnittest = response.totalMethods
      this.pieChartDatasets  = [ {
        data: [ this.missingUnitTest, this.totalUnittest - this.missingUnitTest ]
      } ];
      this.showTheUt = response.content
    })
  }

  generateUts = (): void => {
    this.isLoading = true
    const startTime = new Date();
    this.load.LoadOpenAidata(this.showTheUt).subscribe((data) => {
      this.isLoading = false
      const endTime = new Date();
      const timeElapsed = (endTime.getTime() - startTime.getTime()) / 1000;
      let timeUnit;
    let timeValue;
    if (timeElapsed < 60) {
      timeUnit = 'Sec';
      timeValue = Math.round(timeElapsed);
    } else {
      timeUnit = 'min';
      timeValue = Math.round(timeElapsed / 60);
    }
 
      console.log("data is", data.choices[0].message.content)
      //this.showTheUt = data.choices[0].message.content
      this.downloadFile(data.choices[0].message.content, `Generated-UTs-${environment.model}-${timeValue}${timeUnit}`)
    })
  }

  enableDisableButton = (): void => {
    if (!this.initialValue) {
      this.initialValue = true
    } else {
      this.initialValue = false
    }
  }

  downloadFile = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: 'text/plain' });
    this.anchor = document.createElement('a');
    this.anchor.download = filename;
    this.anchor.href = window.URL.createObjectURL(blob);
    this.anchor.target = '_blank';
    this.anchor.click();
  }

  submitForm = (): void => {
    this.showTheUt = this.userForm.value.userinput
    this.generateUts()
  }

  switchPages = (): void => {
    this.showFooter = !this.showFooter
  }

  onFileSelected = (event: any): void => {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.showUploadedFile = true
      this.showTheUt = 'Provide me Unit test for all the methods for the below file \n' + (e.target.result)
      setTimeout(() =>{
        this.showUploadedFile = false
      }, 3000)
      console.log(e.target.result); // This will log the file content to the console
    };

    reader.readAsText(file);
  }
}










