import '/conf/const.dart';
import '/data/api.dart';
import 'ForgotPasswordScreen.dart';
import 'register.dart';
import '/mainpage.dart';
import 'package:flutter/material.dart';
import '../../data/sharepre.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  TextEditingController accountController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  login() async {
    try {
      // Lấy token từ API login
      String token = await APIRepository().login(accountController.text, passwordController.text);

      // Sau khi có token, gọi API để lấy thông tin user
      var user = await APIRepository().current(token);

      // Lưu thông tin user và token vào share preference
      saveUser(user);
      saveToken(token);

      // Chuyển hướng đến trang chính sau khi đăng nhập thành công
      Navigator.push(context, MaterialPageRoute(builder: (context) => const Mainpage()));

      // Trả về token (nếu cần thiết)
      return token;
    } catch (ex) {
      // Xử lý ngoại lệ nếu có
      print(ex);
      rethrow;
    }
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
            child: GestureDetector(
              onTap: () {
                // Chuyển hướng đến ForgotPasswordScreen khi nhấn vào
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ForgotPasswordScreen()),
                );
              },
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
                            )
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
                        child: Column(
                          children: [
                            TextFormField(
                              controller: accountController,
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
                                iconColor: Colors.orange,
                                icon: Icon(Icons.person),
                              ),
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
                            Container(
                              alignment: Alignment.topRight,
                              child: GestureDetector(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (context) => const ForgotPasswordScreen()),
                                  );
                                },
                                child: const Text(
                                  "Forgot Password?",
                                  style: TextStyle(
                                    color: Color.fromARGB(255, 12, 45, 72),
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
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
              ),
            ),
          ),
        ],
      ),
    );
  }
}
