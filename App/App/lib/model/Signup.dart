class Signup {
  final String email;
  final String password;

  Signup({
    required this.email,
    required this.password,
  });

  // Chuyển đối tượng thành Map<String, dynamic>
  Map<String, dynamic> toMap() {
    return {
      'email': email,
      'password': password,
    };
  }

  // Chuyển đối tượng thành JSON
  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
    };
  }
}
