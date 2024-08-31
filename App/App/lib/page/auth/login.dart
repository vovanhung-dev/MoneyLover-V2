import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shoehubapp/model/user.dart';
import '/data/api.dart';
import '/data/sharepre.dart';
import 'register.dart';
import '/mainpage.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<void> login() async {
    if (_formKey.currentState?.validate() ?? false) {
      try {
        final loginResponse = await APIRepository().login(
          emailController.text,
          passwordController.text,
        );

        if (loginResponse != null) {
          await saveUser(loginResponse.user);
          await saveToken(loginResponse.accessToken);

          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const Mainpage()),
          );
        } else {
          _showErrorDialog("Login failed");
        }
      } catch (ex) {
        _showErrorDialog("Exception occurred during login: $ex");
      }
    }
  }

  Future<void> _showSuccessDialog(String message) {
    return showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Success'),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _showErrorDialog(String message) {
    return showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Error'),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _showForgotPasswordDialog() {
    final TextEditingController forgotPasswordEmailController = TextEditingController();

    return showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Forgot Password'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: forgotPasswordEmailController,
                decoration: const InputDecoration(
                  labelText: "Email",
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () async {
                  final email = forgotPasswordEmailController.text.trim();

                  if (email.isEmpty) {
                    _showErrorDialog("Please enter your email");
                    return;
                  }

                  try {
                    final response = await APIRepository().forgotPassword(email);

                    if (response == "Password reset email sent") {
                      Navigator.pop(context); // Close the dialog
                      _showOtpDialog(email); // Show OTP dialog
                    } else {
                      _showErrorDialog(response);
                    }
                  } catch (ex) {
                    _showErrorDialog("An error occurred: $ex");
                  }
                },
                child: const Text("Submit"),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _showOtpDialog(String email) {
    final TextEditingController otpController = TextEditingController();
    final TextEditingController newPasswordController = TextEditingController();
    final TextEditingController confirmPasswordController = TextEditingController();

    return showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Enter OTP'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: otpController,
                decoration: const InputDecoration(
                  labelText: "OTP",
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: newPasswordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: "New Password",
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: confirmPasswordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: "Confirm Password",
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () async {
                  final otp = otpController.text.trim();
                  final newPassword = newPasswordController.text.trim();
                  final confirmPassword = confirmPasswordController.text.trim();

                  if (otp.isEmpty || newPassword.isEmpty || confirmPassword.isEmpty) {
                    _showErrorDialog("Please fill in all fields");
                    return;
                  }

                  if (newPassword != confirmPassword) {
                    _showErrorDialog("Passwords do not match");
                    return;
                  }

                  try {
                    final otpVerificationResponse = await APIRepository().submitOtp(email, otp);

                    if (otpVerificationResponse == "OTP verified successfully") {
                      final changePasswordResponse = await APIRepository().changePasswordForgot(email, newPassword);

                      if (changePasswordResponse == "Password changed successfully") {
                        Navigator.pop(context); // Close the OTP dialog
                        _showSuccessDialog("Password changed successfully");
                      } else {
                        _showErrorDialog(changePasswordResponse);
                      }
                    } else {
                      _showErrorDialog(otpVerificationResponse);
                    }
                  } catch (ex) {
                    _showErrorDialog("An error occurred: $ex");
                  }
                },
                child: const Text("Submit"),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Login"),
      ),
      body: CustomScrollView(
        slivers: [
          SliverFillRemaining(
            hasScrollBody: false,
            child: Container(
              decoration: const BoxDecoration(color: Colors.orange),
              child: Column(
                children: [
                  Expanded(
                    flex: 1,
                    child: Container(
                      alignment: Alignment.topLeft,
                      padding: const EdgeInsets.all(16),
                      decoration: const BoxDecoration(color: Colors.orange),
                      child: const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Login",
                            style: TextStyle(color: Colors.white, fontSize: 30),
                          ),
                          Text(
                            "Welcome Back",
                            style: TextStyle(color: Colors.white, fontSize: 16),
                          ),
                        ],
                      ),
                    ),
                  ),
                  Expanded(
                    flex: 3,
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                        ),
                      ),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            TextFormField(
                              controller: emailController,
                              cursorColor: Colors.orange,
                              decoration: const InputDecoration(
                                enabledBorder: UnderlineInputBorder(
                                  borderSide: BorderSide(color: Colors.orange, width: 1),
                                ),
                                focusedBorder: UnderlineInputBorder(
                                  borderSide: BorderSide(color: Colors.orange, width: 1),
                                ),
                                labelText: "Email",
                                labelStyle: TextStyle(color: Color.fromARGB(255, 12, 45, 72)),
                                icon: Icon(Icons.person),
                                iconColor: Colors.orange,
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your email';
                                }
                                if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                                  return 'Please enter a valid email address';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: passwordController,
                              obscureText: true,
                              cursorColor: Colors.orange,
                              decoration: const InputDecoration(
                                enabledBorder: UnderlineInputBorder(
                                  borderSide: BorderSide(color: Colors.orange, width: 1),
                                ),
                                focusedBorder: UnderlineInputBorder(
                                  borderSide: BorderSide(color: Colors.orange, width: 1),
                                ),
                                labelText: "Password",
                                labelStyle: TextStyle(color: Color.fromARGB(255, 12, 45, 72)),
                                icon: Icon(Icons.password),
                                iconColor: Colors.orange,
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your password';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 10),
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      shadowColor: Colors.orange,
                                      backgroundColor: const Color.fromARGB(255, 255, 251, 244),
                                      foregroundColor: Colors.orange,
                                    ),
                                    onPressed: login,
                                    child: const Text(
                                      "Login",
                                      style: TextStyle(color: Colors.orange),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: OutlinedButton(
                                    style: OutlinedButton.styleFrom(
                                      shadowColor: Colors.orange,
                                      foregroundColor: Colors.orange,
                                      side: const BorderSide(color: Colors.orange, width: 1),
                                    ),
                                    onPressed: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(builder: (context) => const Register()),
                                      );
                                    },
                                    child: const Text("Register"),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            TextButton(
                              onPressed: _showForgotPasswordDialog,
                              child: const Text("Forgot Password?", style: TextStyle(color: Colors.orange)),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
