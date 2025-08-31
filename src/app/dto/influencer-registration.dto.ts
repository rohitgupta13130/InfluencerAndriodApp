export class InfluencerRegistrationDto{
    fullName : string = '';
    email : string = '';
    username: string = '';
    passwordHash: string='';
    bio : string = '';
    profilePicUrl : string = '';
    category : string = '';
    followersCount?: number;
    platform?: string;
    socialhandle?: string;
    
}


