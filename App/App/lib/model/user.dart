class User {
  String? username;
  String? email;
  bool? enable;

  User({
    this.username,
    this.email,
    this.enable,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      username: json['username'],
      email: json['email'],
      enable: json['_enable'],
    );
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {};
    data['username'] = username;
    data['email'] = email;
    data['_enable'] = enable;
    return data;
  }

  static User userEmpty() {
    return User(
      username: '',
      email: '',
      enable: false,
    );
  }
}
