class Signup {
  final String email;
  final String password;
  final String username;

  Signup({
    required this.email,
    required this.password,
    required this.username,
  });

  // Chuyển đối tượng thành Map<String, dynamic>
  Map<String, dynamic> toMap() {
    return {
      'email': email,
      'password': password,
      'username': username,

    };
  }

  // Chuyển đối tượng thành JSON
  Map<String, dynamic> toJson() => {
    'email': email,
    'password': password,
    'username': username,
  };
}
