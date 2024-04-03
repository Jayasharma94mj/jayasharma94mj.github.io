import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SampleComponent } from './sample/sample.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

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
  missingUnitTest = 0
  totalUnittest = 0
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
    this.load.LoadOpenAidata(this.showTheUt).subscribe((data) => {
      this.isLoading = false
      console.log("data is", data.choices[0].message.content)
      //this.showTheUt = data.choices[0].message.content
      this.downloadFile(data.choices[0].message.content, "Generated-Uts")
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
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = '_blank';
    anchor.click();
  }

  submitForm = (): void => {
    this.showTheUt = this.userForm.value.userinput
    this.generateUts()
  }

  switchPages = (): void => {
    this.showFooter = !this.showFooter
  }
}










