class Signup {
  final String username;
  final String email;
  final String password;
  final String phone;
  final String role;
  final String status;

  Signup({
    required this.username,
    required this.email,
    required this.password,
    required this.phone,
    required this.role,
    required this.status,
  });

  factory Signup.fromJson(Map<String, dynamic> json) {
    return Signup(
      username: json['username'],
      email: json['email'],
      password: json['password'],
      phone: json['phone'],
      role: json['role'],
      status: json['status'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'username': username,
      'email': email,
      'password': password,
      'phone': phone,
      'role': role,
      'status': status,
    };
  }
}
