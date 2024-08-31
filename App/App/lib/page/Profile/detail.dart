import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../data/api.dart';
import '../../model/user.dart';
import '../Category/CategoryScreen.dart';

class Detail extends StatefulWidget {
  const Detail({Key? key}) : super(key: key);

  @override
  State<Detail> createState() => _DetailState();
}

class _DetailState extends State<Detail> {
  late User user;
  bool isLoading = true;
  final _emailController = TextEditingController();
  final _oldPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final APIRepository _apiRepository = APIRepository(); // Initialize the API repository

  @override
  void initState() {
    super.initState();
    getDataUser();
  }

  getDataUser() async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    String strUser = pref.getString('user')!;

    user = User.fromJson(jsonDecode(strUser));
    _emailController.text = user.email!;
    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.teal[50],
      appBar: AppBar(
        backgroundColor: Colors.teal,
        title: const Text('Profile'),
        centerTitle: true,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 80,
              backgroundColor: Colors.teal,
              child: Text(
                user.username![0].toUpperCase(),
                style: TextStyle(
                  fontSize: 50,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              user.username!,
              style: TextStyle(
                fontSize: 24,
                color: Colors.teal[800],
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              user.email!,
              style: TextStyle(
                fontSize: 16,
                color: Colors.teal[600],
              ),
            ),
            const SizedBox(height: 30),
            Expanded(
              child: ListView(
                children: [
                  _buildCard(
                    Icons.email,
                    "Email",
                    user.email!,
                  ),
                  const SizedBox(height: 16),
                  _buildCard(
                    Icons.person,
                    "Tên đăng nhập",
                    user.username!,
                  ),
                  const SizedBox(height: 30),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => CategoryScreen(),
                        ),
                      );
                    },
                    child: Text('Go to Categories'),
                    style: ElevatedButton.styleFrom(
                      primary: Colors.white,
                      padding: EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                      textStyle: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 30),
                  ElevatedButton(
                    onPressed: _showChangePasswordDialog,
                    child: Text('Change Password'),
                    style: ElevatedButton.styleFrom(
                      primary: Colors.white,
                      padding: EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                      textStyle: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showChangePasswordDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Change Password'),
          content: _buildPasswordChangeForm(),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
              style: TextButton.styleFrom(
                primary: Colors.teal,
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildPasswordChangeForm() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        TextField(
          controller: _oldPasswordController,
          obscureText: true,
          decoration: InputDecoration(
            labelText: 'Old Password',
            border: OutlineInputBorder(),
            suffixIcon: Icon(Icons.lock_outline),
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _newPasswordController,
          obscureText: true,
          decoration: InputDecoration(
            labelText: 'New Password',
            border: OutlineInputBorder(),
            suffixIcon: Icon(Icons.lock_outline),
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _confirmPasswordController,
          obscureText: true,
          decoration: InputDecoration(
            labelText: 'Confirm New Password',
            border: OutlineInputBorder(),
            suffixIcon: Icon(Icons.lock_outline),
          ),
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: _changePassword,
          child: Text('Change Password'),
          style: ElevatedButton.styleFrom(
            primary: Colors.white,
            padding: EdgeInsets.symmetric(vertical: 12, horizontal: 20),
            textStyle: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }

  void _changePassword() async {
    final email = _emailController.text.trim();
    final oldPassword = _oldPasswordController.text.trim();
    final newPassword = _newPasswordController.text.trim();
    final confirmPassword = _confirmPasswordController.text.trim();

    if (newPassword != confirmPassword) {
      _showDialog(
        title: 'Error',
        message: "New password and confirmation do not match.",
        isSuccess: false,
      );
      return;
    }

    final response = await _apiRepository.changePassword(
      email,
      oldPassword,
      newPassword,
      confirmPassword,
    );

    Navigator.of(context).pop(); // Close the dialog after submission

    _showDialog(
      title: response == "Password changed successfully" ? 'Success' : 'Error',
      message: response,
      isSuccess: response == "Password changed successfully",
    );
  }

  void _showDialog({
    required String title,
    required String message,
    required bool isSuccess,
  }) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(title),
          content: Text(message),
          backgroundColor: isSuccess ? Colors.green[50] : Colors.red[50],
          titleTextStyle: TextStyle(
            color: isSuccess ? Colors.green[800] : Colors.red[800],
            fontWeight: FontWeight.bold,
          ),
          contentTextStyle: TextStyle(
            color: isSuccess ? Colors.green[700] : Colors.red[700],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('OK'),
              style: TextButton.styleFrom(
                primary: isSuccess ? Colors.green : Colors.red,
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildCard(IconData icon, String title, String subtitle) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: Icon(
          icon,
          color: Colors.teal,
          size: 30,
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: Colors.teal[800],
          ),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(
            color: Colors.teal[600],
          ),
        ),
      ),
    );
  }
}
