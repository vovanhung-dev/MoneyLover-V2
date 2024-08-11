import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../model/user.dart';

class Detail extends StatefulWidget {
  const Detail({Key? key}) : super(key: key);

  @override
  State<Detail> createState() => _DetailState();
}

class _DetailState extends State<Detail> {
  late User user;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    getDataUser();
  }

  getDataUser() async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    String strUser = pref.getString('user')!;

    user = User.fromJson(jsonDecode(strUser));
    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.teal[50], // Tông màu nền tươi sáng
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
                ],
              ),
            ),
          ],
        ),
      ),
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
