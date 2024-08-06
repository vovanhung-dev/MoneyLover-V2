import '../../model/register.dart';
import '/data/api.dart';
import '/page/auth/login.dart';
import 'package:flutter/material.dart';

class Register extends StatefulWidget {
  const Register({Key? key}) : super(key: key);

  @override
  State<Register> createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  final int _gender = 0;
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _phoneNumberController = TextEditingController();

  Future<String> register() async {
    try {

      final response = await APIRepository().register(Signup(
          username: _usernameController.text,
          email: _emailController.text,
          password: _passwordController.text,
          phone: _phoneNumberController.text,
          role: "isClient",
          status: "actived"
      ));
      if (response == "ok") {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      } else {
        // Handle error or display message
        print(response);
      }

      return response;
    } catch (ex) {
      // Handle error
      print(ex);
      return "Error";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Register"),
      ),
      body: CustomScrollView(
        slivers: [
          SliverFillRemaining(
            hasScrollBody: false,
            child: Container(
              child: Expanded(
                flex: 1,
                child: Container(
                  decoration: const BoxDecoration(
                    color: Colors.orange,
                  ),
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
                                "Register",
                                style: TextStyle(
                                    color: Colors.white, fontSize: 30),
                              ),
                              Text(
                                "Create an account",
                                style: TextStyle(
                                    color: Colors.white, fontSize: 16),
                              )
                            ],
                          ),
                        ),
                      ),
                      Expanded(
                        flex: 8,
                        child: Container(
                          decoration: const BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.only(
                                  topLeft: Radius.circular(30),
                                  topRight: Radius.circular(30))),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                signUpWidget(),
                                const SizedBox(height: 16),
                                Row(
                                  crossAxisAlignment:
                                  CrossAxisAlignment.center,
                                  children: [
                                    Expanded(
                                      child: OutlinedButton(
                                        style: OutlinedButton.styleFrom(
                                          side: const BorderSide(
                                              color: Colors.orange, width: 1),
                                          shadowColor: Colors.orange,
                                          foregroundColor: Colors.orange,
                                        ),
                                        onPressed: () async {
                                          String respone = await register();
                                          if (respone != "ok") {
                                            print(respone);
                                          }
                                        },
                                        child: const Text('Register'),
                                      ),
                                    ),
                                    const SizedBox(
                                      width: 16,
                                    ),
                                  ],
                                )
                              ],
                            ),
                          ),
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }

  getGender() {
    if (_gender == 1) {
      return "Male";
    } else if (_gender == 2) {
      return "Female";
    }
    return "Other";
  }

  // Widget text field for registration
  Widget textField(TextEditingController controller, String label) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10),
      child: TextFormField(
        controller: controller,
        obscureText: label.contains('Password'),
        cursorColor: Colors.orange,
        decoration: InputDecoration(
          enabledBorder: const OutlineInputBorder(
            borderSide: BorderSide(color: Colors.orange, width: 1),
          ),
          focusedBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.orange, width: 1),
          ),
          labelText: label,
          labelStyle: const TextStyle(color: Color.fromARGB(255, 12, 45, 72)),
          iconColor: Colors.orange,
        ),
      ),
    );
  }

  Widget signUpWidget() {
    return Column(
      children: [
        textField(_usernameController, "Username"),
        textField(_emailController, "Email"),
        textField(_passwordController, "Password"),
        textField(_phoneNumberController, "Phone Number"),
      ],
    );
  }
}
