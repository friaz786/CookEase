class UserModel {
  constructor(
    name,
    phoneNumber,
    role,
    cuisines,
    followers = [],
    following = [],
    subscribers = [],
    subscribedTo = []
  ) {
    // Add followers parameter with a default empty array
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.followers = followers;
    this.following = following;
    this.cuisines = cuisines;
    this.subscribers = subscribers;
    this.subscribedTo = subscribedTo;
  }

  toFirestore() {
    return {
      name: this.name,
      phoneNumber: this.phoneNumber,
      role: this.role,
      cuisines: this.cuisines,
      followers: this.followers,
      following: this.following,
      subscribers: this.subscribers,
      subscribedTo: this.subscribedTo,
    };
  }
}

export default UserModel;
