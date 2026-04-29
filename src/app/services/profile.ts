import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // ✅ REQUIRED

@Injectable({
  providedIn: 'root',
})
export class Profile {

  constructor(private http: HttpClient) {} // ✅ INJECT

  // getUserById(id: number) {
  //   const token = localStorage.getItem('token');

  //   return this.http.get(
  //     `https://influencerapi-09to.onrender.com/api/user/${id}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     }
  //   );
  // }


  getMyProfile() {
  const token = localStorage.getItem('token');

  return this.http.get(
    `https://influencerapi-09to.onrender.com/api/user/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}
}