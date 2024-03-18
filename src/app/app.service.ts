import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, ReplaySubject, from, of, range, map } from 'rxjs';
import { OpenAIClient } from "@azure/openai";
import { AzureKeyCredential } from "@azure/core-auth";
import * as fs from "fs";


@Injectable()
  export class AppService {
    private baseUrl = 'http://localhost:3000';
    private client: any;
    constructor(private http: HttpClient) {
      const endpoint = "https://factexpdaiopi02.openai.azure.com/";
      const credential = new AzureKeyCredential("");
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
      // const completion = await this.client.chat.completions.create({
      //   model: "gpt-35-UT",
      //   messages: [
      //     {
      //       role: "user",
      //       content: userMessage,
      //     },
      //   ],
      // });
  
      // const responseMessage = completion.results[0].output;
      // return responseMessage;
    }

    /* this method will get me the data from Azure open api without any package*/
    LoadOpenAidata(data: string): Observable<any> {
      let accessToken = '';
      const httpOptions = {
          headers: new HttpHeaders({
            "api-key": `${accessToken}`,
            "Content-Type": 'application/json',
          })
        };
      return this.http.post('https://factexpdaiopi02.openai.azure.com/openai/deployments/gpt-35-UT/chat/completions?api-version=2023-05-15', {
          "model": "gpt-35-UT",
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