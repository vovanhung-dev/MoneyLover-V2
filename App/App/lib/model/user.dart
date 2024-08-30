class User {
  String? id;          // Unique identifier for the user
  String? username;    // Username of the user
  String? email;       // Email address of the user
  bool? enable;        // Status indicating if the user is enabled

  User({
    this.id,
    this.username,
    this.email,
    this.enable,
  });

  // Factory method to create a User object from JSON data
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],                        // Assign the id field from JSON
      username: json['username'],            // Assign the username field from JSON
      email: json['email'],                  // Assign the email field from JSON
      enable: json['_enable'],               // Assign the enable field from JSON
    );
  }

  // Method to convert a User object to a JSON map
  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {};
    data['id'] = id;                         // Include the id field in the JSON map
    data['username'] = username;             // Include the username field in the JSON map
    data['email'] = email;                   // Include the email field in the JSON map
    data['_enable'] = enable;                // Include the enable field in the JSON map
    return data;
  }

  // Static method to return an empty User object
  static User userEmpty() {
    return User(
      id: '',                                // Set the id field to an empty string
      username: '',                           // Set the username field to an empty string
      email: '',                              // Set the email field to an empty string
      enable: false,                          // Set the enable field to false
    );
  }

  // Method to check if the current User object is empty
  bool isEmpty() {
    return (id == null || id!.isEmpty) &&          // Check if id is null or empty
        (username == null || username!.isEmpty) &&  // Check if username is null or empty
        (email == null || email!.isEmpty) &&    // Check if email is null or empty
        (enable == null || enable == false);    // Check if enable is null or false
  }
}
