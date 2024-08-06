class Signup {
  final String username;
  final String email;
  final String password;
  final String phone;

  Signup({
    required this.username,
    required this.email,
    required this.password,
    required this.phone,
  });

  Map<String, dynamic> toMap() {
    return {
      'username': username,
      'email': email,
      'password': password,
      'phone': phone,
    };
  }
}
