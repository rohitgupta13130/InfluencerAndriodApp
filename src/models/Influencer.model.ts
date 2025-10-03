export interface Influencer{
    _id: string;
    fullName: string;
    email?: string;
    username?: string;
    bio?: string;
    profilePicUrl?: string;
    category?: string;
    followersCount?: number;
    platform?: string;
}