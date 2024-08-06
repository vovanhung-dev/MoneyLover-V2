import 'package:flutter/material.dart';
import '../../data/api.dart';
import '../../data/sharepre.dart';
import '../../model/user.dart';

class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  State<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  TextEditingController currentPasswordController = TextEditingController();
  TextEditingController newPasswordController = TextEditingController();
  bool isLoading = false;

  changePassword() async {
    setState(() {
      isLoading = true;
    });
    try {
      String? token = await getToken();
      User? user = await getUser();

      if (token == null) {
        throw Exception("No token found");
      }
      if (user == null) {
        throw Exception("No user found");
      }

      String response = await APIRepository().changePasswordApp(
        user.id!,
        currentPasswordController.text,
        newPasswordController.text,
        token,
      );

      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(response)));
    } catch (ex) {
      print(ex);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to change password: $ex")),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Change Password")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: currentPasswordController,
              decoration: InputDecoration(labelText: 'Current Password'),
              obscureText: true,
            ),
            TextField(
              controller: newPasswordController,
              decoration: InputDecoration(labelText: 'New Password'),
              obscureText: true,
            ),
            SizedBox(height: 20),
            isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(
              onPressed: changePassword,
              child: Text('Change Password'),
            ),
          ],
        ),
      ),
    );
  }
}
