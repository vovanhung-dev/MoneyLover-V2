import 'package:flutter/material.dart';

class FolderManagement extends StatefulWidget {
  const FolderManagement({Key? key}) : super(key: key);

  @override
  State<FolderManagement> createState() => _FolderManagementState();
}

class _FolderManagementState extends State<FolderManagement> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text("Đây là trang home"),
      ),
    );
  }
}
