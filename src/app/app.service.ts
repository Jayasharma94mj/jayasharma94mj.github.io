import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, ReplaySubject, from, of, range, map } from 'rxjs';
import { OpenAIClient } from "@azure/openai";
import { AzureKeyCredential } from "@azure/core-auth";
import * as fs from "fs";
import { environment } from '../environments/environment.prod';


@Injectable()
  export class AppService {
    private baseUrl = 'https://jayaopenapi.onrender.com';
    //private baseUrl = 'http://localhost:3000';
    private client: any;
    private apiKey = environment.apiKey;
    private model = environment.model
    constructor(private http: HttpClient) {
      const endpoint = "https://factexpdaiopi02.openai.azure.com/";
      const credential = new AzureKeyCredential(this.apiKey);
      const options = { apiVersion: '2023-05-15' }; 
      this.client = new OpenAIClient(endpoint, credential, options);
     }

     /* this method will get me the data from Azure open api with package*/
     async getResponse(userMessage: string): Promise<any> {
      const messages = [
            {
              role: "user",
              content: userMessage,
            },
          ]
      const events = this.client.getChatCompletions('gpt-35-UT', messages);

      return events
    }

    /* this method will get me the data from Azure open api without any package*/
    LoadOpenAidata(data: string): Observable<any> {
      let accessToken = this.apiKey;
      const httpOptions = {
          headers: new HttpHeaders({
            "api-key": `${accessToken}`,
            "Content-Type": 'application/json',
          })
        };
      return this.http.post('https://factexpdaiopi02.openai.azure.com/openai/deployments/' + this.model + '/chat/completions?api-version=2023-05-15', {
          "model": this.model,
          "messages": [
            {
              "role": "system",
              "content": "You are a helpful assistant."
            },
            {
              "role": "user",
              "content": data
            }
          ]
        }, httpOptions)
      .pipe(map(data => { return data } ))
    }
      
      /*This method will get me the missing methods from the node script*/
      runTests() {
        return this.http.post<any>(`${this.baseUrl}/run-tests`, {}).pipe(map(data => { return data } ));
      }
  }