import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Influencer} from "src/models/influencer.model";

@Injectable({providedIn:'root'})

export class InfluencerService {
    private readonly base = 'http://localhost:1000';

    constructor(private http:HttpClient){}

    getAll(): Observable<Influencer[]>{
        return this.http.get<Influencer[]>(`${this.base}/influencer`);
    }

    getBaseUrl(): string {
        return this.base;
    }
}